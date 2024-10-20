import { describe, test, expect } from "vitest";
import {
  createDnsQuery,
  serializeDnsQuery,
  parseDnsMessage,
  stringToDNSName,
} from "./dns-message";

function spacedHexToArrayBuffer(hex: string) {
  const hexArray = hex.split(/\s+/).filter((h) => h.length > 0);
  const buffer = new ArrayBuffer(hexArray.length);
  const view = new Uint8Array(buffer);
  hexArray.forEach((h, i) => {
    view[i] = parseInt(h, 16);
  });
  return buffer;
}

describe("parseAnswer", () => {
  test("Cloudflare meta query", () => {
    const input = spacedHexToArrayBuffer(
      "00 00 81 80 00 01 00 02 00 00 00 00 0a 63 6c 6f 75 64 66 6c 61 72 65 03 63 6f 6d 00 00 01 00 01 c0 0c 00 01 00 01 00 00 01 10 00 04 68 10 84 e5 c0 0c 00 01 00 01 00 00 01 10 00 04 68 10 85 e5",
    );

    const message = parseDnsMessage(input);
    const ipAddress1 = [104, 16, 132, 229];
    const ipAddress2 = [104, 16, 133, 229];

    expect(message).toStrictEqual({
      id: 0,
      qr: 1,
      opcode: 0,
      aa: 0,
      tc: 0,
      rd: 1,
      ra: 1,
      z: 0,
      rcode: 0,
      qdcount: 1,
      ancount: 2,
      nscount: 0,
      arcount: 0,
      questions: [
        {
          qname: stringToDNSName("cloudflare.com"),
          qtype: 1,
          qclass: 1,
        },
      ],
      answers: [
        {
          name: stringToDNSName("cloudflare.com"),
          type: 1,
          class: 1,
          ttl: 272,
          rdlength: 4,
          rdata: ipAddress1,
        },
        {
          name: stringToDNSName("cloudflare.com"),
          type: 1,
          class: 1,
          ttl: 272,
          rdlength: 4,
          rdata: ipAddress2,
        },
      ],
      authorityRecords: [],
      additionalRecords: [],
    });
  });

  test("roundtrip", () => {
    const query = createDnsQuery([
      {
        qname: stringToDNSName("example.com"),
        qtype: 1, // A
        qclass: 1, // INTERNET
      },
    ]);

    // it will add random padding to the message
    // so we cannot compare the buffers directly
    const serialized = serializeDnsQuery(query);

    const message = parseDnsMessage(serialized);

    expect(message).toStrictEqual(query);
  });
});
