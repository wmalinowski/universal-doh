type RawDnsMessage = ArrayBuffer;

interface DnsMessage {
  id: number;
  // query (0), response (1)
  qr: BinaryFlag;
  /*
    0 a standard query (QUERY)
    1 an inverse query (IQUERY)
    2 a server status request (STATUS)
    3-15 reserved for future use
  */
  opcode: FourBitNumber;
  // Authoritative Answer
  aa: BinaryFlag;
  // TrunCation
  tc: BinaryFlag;
  // Recursion Desired
  rd: BinaryFlag;
  // Recursion Available
  ra: BinaryFlag;
  // reserved for future use - must be 0
  z: ThreeBitNumber;
  /*
  Response code
  0 No error condition
  1 Format error
  2 Server failure
  3 Name Error
  4 Not Implemented
  5 Refused
  6-15 Reserved for future use.
  */
  rcode: FourBitNumber;
  // number of entries in the question section (0-65535)
  qdcount: number;
  // number of resource records in the answer section (0-65535)
  ancount: number;
  // number of name server resource records in the authority records section (0-65535)
  nscount: number;
  // number of resource records in the additional records section (0-65535)
  arcount: number;

  questions: DnsQuestion[];
  answers: DnsResourceRecord[];
  authorityRecords: DnsResourceRecord[];
  additionalRecords: Array<DnsOptRecord | DnsResourceRecord>;
}

type Bytes = number[];
type Label = Bytes;
type DNSName = Label[];

interface DnsQuestion {
  qname: DNSName;
  // 16 bit unsigned integer
  qtype: number;
  // 16 bit unsigned integer
  qclass: number;
}

interface Opt {
  optionCode: number;
  optionLength: number;
  optionData: Bytes;
}

export interface DnsOptRecord {
  name: DNSName;
  type: 41;
  // 16 bit unsigned integer
  maxPayloadSize: number;
  // TTL field is used as the extended RCODE and flags
  // https://datatracker.ietf.org/doc/html/rfc6891#section-6.1.3
  extendedRcode: number;
  version: number;
  do: BinaryFlag;
  z: number;
  // 16 bit unsigned integer
  rdlength: number;
  // RDATA field is used for EDNS0 options
  rdata: Opt[];
}

export interface DnsResourceRecord {
  name: DNSName;
  // 16 bit unsigned integer
  type: number;
  // 16 bit unsigned integer
  class: number;
  // 32 bit unsigned integer
  ttl: number;
  // 16 bit unsigned integer
  rdlength: number;
  rdata: Bytes;
}

type BinaryFlag = 0 | 1;
type ThreeBitNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type FourBitNumber =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

export function dnsNameToString(name: DNSName): string {
  return name.map((label) => String.fromCharCode(...label)).join(".");
}

export function stringToDNSName(name: string): DNSName {
  // we can assume string is ascii but it may not be a valid domain name
  const labels = name.split(".").filter((label) => label.length > 0);
  const dnsName: DNSName = [];
  for (const label of labels) {
    if (label.length < 1 || label.length > 63) {
      throw new Error(
        `Label "${label}" must be between 1 and 63 characters long`,
      );
    }

    if (label.startsWith("-") || label.endsWith("-")) {
      throw new Error(`Label "${label}" cannot start or end with a hyphen`);
    }

    const bytes: Bytes = [];

    for (const char of label) {
      const code = char.charCodeAt(0);
      if (
        (code >= 48 && code <= 57) || // '0'-'9'
        (code >= 97 && code <= 122) || // 'a'-'z'
        code === 45 // '-'
      ) {
        bytes.push(code);
      } else {
        throw new Error(`Invalid character '${char}' in label "${label}"`);
      }
    }
    dnsName.push(bytes);
  }
  return dnsName;
}

function createDnsMessage() {
  return {
    id: 0,
    qr: 0,
    opcode: 0,
    aa: 0,
    tc: 0,
    rd: 0,
    ra: 0,
    z: 0,
    rcode: 0,
    qdcount: 0,
    ancount: 0,
    nscount: 0,
    arcount: 0,
    questions: [],
    answers: [],
    authorityRecords: [],
    additionalRecords: [],
  } as DnsMessage;
}

export function createDnsQuery(questions: DnsQuestion[]): DnsMessage {
  const message = createDnsMessage();
  message.rd = 1;
  message.qdcount += questions.length;
  message.questions.push(...questions);

  // notify the server that we support EDNS0 by adding an OPT record
  message.arcount += 1;
  message.additionalRecords.push({
    name: [],
    type: 41,
    maxPayloadSize: 0xffff,
    extendedRcode: 0,
    version: 0,
    do: 0,
    z: 0,
    rdlength: 0,
    rdata: [],
  } as DnsOptRecord);

  return message;
}

export function serializeDnsQuery(query: DnsMessage): RawDnsMessage {
  const buffer = new ArrayBuffer(1024);
  const message = new DataView(buffer);

  let offset = 0;
  offset = serializeHeader(message, offset, query);

  for (const question of query.questions) {
    offset = serializeQuestion(message, offset, question);
  }

  // we ignore the answers and authority records for queries,
  // but we include the additional records for EDNS0 support
  if (query.answers.length > 0 || query.authorityRecords.length > 0) {
    throw new Error("Cannot serialize answers or authority records for query");
  }

  for (const record of query.additionalRecords) {
    offset = serializeResourceRecord(message, offset, record);
  }

  // add padding to the message for privacy
  offset = serializeEDNS0Padding(message, offset);

  return buffer.slice(0, offset);
}

function serializeName(message: DataView, offset: number, name: DNSName) {
  // TODO: consider implementing compression
  for (const label of name) {
    message.setUint8(offset++, label.length);
    for (const byte of label) {
      message.setUint8(offset++, byte);
    }
  }

  // empty label to terminate the domain name
  message.setUint8(offset++, 0);

  return offset;
}

function serializeResourceRecord(
  message: DataView,
  offset: number,
  record: DnsResourceRecord | DnsOptRecord,
) {
  offset = serializeName(message, offset, record.name);
  message.setUint16(offset, record.type);
  offset += 2;

  if (record.type === 41) {
    message.setUint16(offset, (<DnsOptRecord>record).maxPayloadSize);
  } else {
    message.setUint16(offset, (<DnsResourceRecord>record).class);
  }
  offset += 2;

  let ttl;
  if (record.type === 41) {
    ttl = (<DnsOptRecord>record).extendedRcode << 24;
    ttl |= (<DnsOptRecord>record).version << 16;
    ttl |= (<DnsOptRecord>record).do << 15;
    ttl |= (<DnsOptRecord>record).z;
  } else {
    ttl = (<DnsResourceRecord>record).ttl;
  }

  message.setUint32(offset, ttl);
  offset += 4;
  message.setUint16(offset, record.rdlength);
  offset += 2;

  if (record.type === 41) {
    // OPT record
    if (record.rdlength !== 0) {
      throw new Error("EDNS0 OPT records not supported");
    }
  } else {
    for (const byte of (<DnsResourceRecord>record).rdata) {
      message.setUint8(offset++, byte);
    }
  }

  return offset;
}

function serializeEDNS0Padding(message: DataView, offset: number) {
  // RFC 8467 - Recommended Strategy: Block-Length Padding

  // padding header of 4 bytes must be included
  const length = offset + 4;
  const padding = Math.ceil(length / 128) * 128 - length;

  // RFC 7830
  message.setUint16(offset, 12); // OPTION-CODE for EDNS0 padding
  offset += 2;
  message.setUint16(offset, padding); // padding length
  offset += 2;
  for (let i = 0; i < padding; i++) {
    // we do not need to generate cryptographically secure random numbers
    // simple random numbers are enough to obfuscate the message
    message.setUint8(offset++, Math.floor(Math.random() * 0xff));
  }

  return offset;
}

function serializeQuestion(
  message: DataView,
  offset: number,
  question: DnsQuestion,
) {
  offset = serializeName(message, offset, question.qname);

  message.setUint16(offset, question.qtype);
  offset += 2;
  message.setUint16(offset, question.qclass);
  offset += 2;

  return offset;
}

function serializeHeader(
  message: DataView,
  offset: number,
  header: DnsMessage,
) {
  // message id
  message.setUint16(offset, header.id);
  offset += 2;

  // flags
  message.setUint16(
    offset,
    ((header.qr & 0b1) << 15) |
      ((header.opcode & 0b1111) << 11) |
      ((header.aa & 0b1) << 10) |
      ((header.tc & 0b1) << 9) |
      ((header.rd & 0b1) << 8) |
      ((header.ra & 0b1) << 7) |
      ((header.z & 0b111) << 4) |
      (header.rcode & 0b1111),
  );
  offset += 2;

  // question records count
  message.setUint16(4, header.qdcount);
  offset += 2;

  // answer records count
  message.setUint16(6, header.ancount);
  offset += 2;

  // authority records count
  message.setUint16(8, header.nscount);
  offset += 2;

  // additional records count
  message.setUint16(10, header.arcount);
  offset += 2;

  return offset;
}

export function parseDnsMessage(
  raw: RawDnsMessage,
  offset: number = 0,
): DnsMessage {
  const rawView = new DataView(raw);
  const message = createDnsMessage();

  offset = parseHeader(rawView, offset, message);

  offset = parseQuestion(rawView, offset, message.qdcount, message.questions);

  offset = parseResourceRecords(
    rawView,
    offset,
    message.ancount,
    message.answers,
  );
  offset = parseResourceRecords(
    rawView,
    offset,
    message.nscount,
    message.authorityRecords,
  );
  offset = parseAdditionalRecords(
    rawView,
    offset,
    message.arcount,
    message.additionalRecords,
  );

  if (offset !== raw.byteLength) {
    // TODO: implement support for parsing padding and replace the warning with error
    console.warn(
      `Unexpected end of message (offset: ${offset}, length: ${raw.byteLength})`,
    );
  }

  return message;
}

function parseQuestion(
  rawView: DataView,
  offset: number,
  number: number,
  records: DnsQuestion[],
) {
  for (let i = 0; i < number; i++) {
    const qname: DNSName = [];
    offset = parseName(rawView, offset, qname, 0);

    const qtype = rawView.getUint16(offset);
    offset += 2;
    const qclass = rawView.getUint16(offset);
    offset += 2;

    records.push({ qname, qtype, qclass });
  }
  return offset;
}

function parseAdditionalRecords(
  rawView: DataView,
  offset: number,
  number: number,
  records: Array<DnsResourceRecord | DnsOptRecord>,
) {
  for (let i = 0; i < number; i++) {
    const name: DNSName = [];
    offset = parseName(rawView, offset, name, 0);

    const type = rawView.getUint16(offset);
    offset += 2;

    if (type === 41) {
      const record: DnsOptRecord = {
        name,
        type,
        maxPayloadSize: 0,
        extendedRcode: 0,
        version: 0,
        do: 0,
        z: 0,
        rdlength: 0,
        rdata: [],
      };

      offset = parseOptRecordBody(rawView, offset, record);

      records.push(record);
    } else {
      const record: DnsResourceRecord = {
        name,
        type,
        class: 0,
        ttl: 0,
        rdlength: 0,
        rdata: [],
      };

      offset = parseResourceRecordBody(rawView, offset, record);

      records.push(record);
    }
  }

  return offset;
}

function parseOptRecordBody(
  rawView: DataView,
  offset: number,
  record: DnsOptRecord,
) {
  record.maxPayloadSize = rawView.getUint16(offset);
  offset += 2;

  // TTL field is used as the extended RCODE and flags
  const ttl = rawView.getUint32(offset);
  offset += 4;

  record.extendedRcode = (ttl & 0xff000000) >> 24;
  record.version = (ttl & 0x00ff0000) >> 16;
  record.do = ((ttl & 0x00008000) >> 15) as BinaryFlag;
  record.z = ttl & 0x00007fff;

  record.rdlength = rawView.getUint16(offset);
  offset += 2;
  for (let j = 0; j < record.rdlength; j++) {
    const opt = {
      optionCode: rawView.getUint16(offset),
      optionLength: rawView.getUint16(offset + 2),
      optionData: [],
    } as Opt;
    offset += 4;
    for (let k = 0; k < opt.optionLength; k++) {
      opt.optionData.push(rawView.getUint8(offset++));
    }
    record.rdata.push(opt);
  }
  return offset;
}

function parseResourceRecordBody(
  rawView: DataView,
  offset: number,
  record: DnsResourceRecord,
) {
  record.class = rawView.getUint16(offset);
  offset += 2;
  record.ttl = rawView.getUint32(offset);
  offset += 4;
  record.rdlength = rawView.getUint16(offset);
  offset += 2;
  for (let j = 0; j < record.rdlength; j++) {
    record.rdata.push(rawView.getUint8(offset++));
  }
  return offset;
}

function parseResourceRecords(
  rawView: DataView,
  offset: number,
  number: number,
  records: DnsResourceRecord[],
) {
  for (let i = 0; i < number; i++) {
    const name: DNSName = [];
    offset = parseName(rawView, offset, name, 0);

    const type = rawView.getUint16(offset);
    offset += 2;

    const record: DnsResourceRecord = {
      name,
      type,
      class: 0,
      ttl: 0,
      rdlength: 0,
      rdata: [],
    };

    offset = parseResourceRecordBody(rawView, offset, record);

    records.push(record);
  }

  return offset;
}

function parseName(
  view: DataView,
  offset: number,
  output: DNSName,
  recursionDepth = 0,
) {
  if (recursionDepth > 20) {
    throw new Error("Too many nested labels");
  }

  let length = view.getUint8(offset++);
  while (length !== 0) {
    const labelType = length >> 6;
    if (labelType === 0b00) {
      // standard label
      const label = [];
      for (let i = 0; i < length; i++) {
        label.push(view.getUint8(offset++));
      }
      output.push(label);
      length = view.getUint8(offset++);
    } else if (labelType === 0b11) {
      // compressed label
      const pointer = ((length & 0b00111111) << 8) | view.getUint8(offset++);
      // ignore the offset as we returning from a "jump"
      parseName(view, pointer, output, recursionDepth + 1);
      break;
    } else {
      // we do not (yet) support extended label types (RFC2671)
      throw new Error(`Invalid label type: ${labelType.toString(2)}`);
    }
  }
  return offset;
}

function parseHeader(raw: DataView, offset: number, output: DnsMessage) {
  output.id = raw.getUint16(offset);
  offset += 2;

  const flags = raw.getUint16(offset);
  offset += 2;

  output.qr = ((flags & 0b1000000000000000) >> 15) as BinaryFlag;
  output.opcode = ((flags & 0b0111100000000000) >> 11) as FourBitNumber;
  output.aa = ((flags & 0b0000010000000000) >> 10) as BinaryFlag;
  output.tc = ((flags & 0b0000001000000000) >> 9) as BinaryFlag;
  output.rd = ((flags & 0b0000000100000000) >> 8) as BinaryFlag;
  output.ra = ((flags & 0b0000000010000000) >> 7) as BinaryFlag;
  output.z = ((flags & 0b0000000001110000) >> 4) as ThreeBitNumber;
  output.rcode = (flags & 0b0000000000001111) as FourBitNumber;

  output.qdcount = raw.getUint16(offset);
  offset += 2;

  output.ancount = raw.getUint16(offset);
  offset += 2;

  output.nscount = raw.getUint16(offset);
  offset += 2;

  output.arcount = raw.getUint16(offset);
  offset += 2;

  return offset;
}
