export const version = __LIB_VERSION__;
import type { DnsResourceRecord, DnsOptRecord } from "./dns-message";
import {
  serializeDnsQuery,
  createDnsQuery,
  parseDnsMessage,
  stringToDNSName,
  dnsNameToString,
} from "./dns-message";
import { domainToAscii } from "./punycode";

export function resolve(name: string, type: string) {
  const qualifiedName = domainToAscii(name);

  const query = createDnsQuery([
    {
      qname: stringToDNSName(qualifiedName),
      qtype: parseInt(type, 10),
      qclass: 1, // INTERNET
    },
  ]);

  const buffer = serializeDnsQuery(query);

  const url = new URL("https://1.1.1.1/dns-query");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/dns-message",
      "Content-Type": "application/dns-message",
    },
    body: buffer,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`,
        );
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      const message = parseDnsMessage(buffer);
      return formatDnsMessage(message);
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

function formatDnsMessage(message: ReturnType<typeof parseDnsMessage>) {
  const formatted = {
    id: message.id,
    authoritativeAnswer: message.aa === 1,
    truncated: message.tc === 1,
    recursionAvailable: message.ra === 1,
    responseCode: message.rcode === 0 ? "OK" : "ERROR",
    questions: message.questions.map((question) => ({
      name: dnsNameToString(question.qname),
      type: question.qtype,
    })),
    answers: message.answers.map((record) => ({
      name: dnsNameToString(record.name),
      type: record.type,
      ttl: record.ttl,
      value: formatRData(record.type, record.rdata),
    })),
    authorityRecords: message.authorityRecords.map((record) => ({
      name: dnsNameToString(record.name),
      type: record.type,
      ttl: record.ttl,
      value: formatRData(record.type, record.rdata),
    })),
    additionalRecords: message.additionalRecords.map((record) => {
      if (record.type === 41) {
        return {
          name: dnsNameToString(record.name),
          type: record.type,
          maxPayloadSize: (<DnsOptRecord>record).maxPayloadSize,
          extendedRcode: (<DnsOptRecord>record).extendedRcode,
          version: (<DnsOptRecord>record).version,
          do: (<DnsOptRecord>record).do,
          z: (<DnsOptRecord>record).z,
          value: (<DnsOptRecord>record).rdata,
        };
      } else {
        return {
          name: dnsNameToString(record.name),
          type: record.type,
          class: (<DnsResourceRecord>record).class,
          ttl: (<DnsResourceRecord>record).ttl,
          value: formatRData(record.type, (<DnsResourceRecord>record).rdata),
        };
      }
    }),
  };
  return JSON.stringify(formatted, null, 2);
}

function formatRData(recordType: number, rdata: number[]) {
  // TODO: this has to be implemented in the parser as the data
  //       may include dns names and labels like for CNAMEs
  //       or TXT (where there are labels but merged into a single string)
  switch (recordType) {
    case 1:
      return rdata.join(".");
    case 28:
      return rdata.map((c) => c.toString(16)).join(":");
    default:
      return rdata;
  }
}
