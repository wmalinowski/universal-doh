import { describe, test, expect } from "vitest";
import { domainToAscii, punycodeEncode } from "./punycode";

describe("ascii domains", () => {
  test("example.com", () => {
    const ascii = domainToAscii("example.com");
    expect(ascii).toBe("example.com");
  });

  test("www.example.com", () => {
    const ascii = domainToAscii("www.example.com");
    expect(ascii).toBe("www.example.com");
  });

  test("WwW.eXaMpLe.CoM", () => {
    const ascii = domainToAscii("www.example.com");
    expect(ascii).toBe("www.example.com");
  });

  test("invalid.....com", () => {
    const ascii = domainToAscii("invalid.....com");
    expect(ascii).toBe("invalid.....com");
  });

  test("xn--84h.com", () => {
    const ascii = domainToAscii("xn--84h.com");
    expect(ascii).toBe("xn--84h.com");
  });
});

// https://unicode.org/reports/tr46/
describe("IDN domains", () => {
  test("Bücher.com", () => {
    const unicode = "bücher.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--bcher-kva.com");
  });

  test("öbb.at", () => {
    const unicode = "öbb.at";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--bb-eka.at");
  });

  test("ÖBB.at", () => {
    const unicode = "ÖBB.at";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--bb-eka.at");
  });

  test("faß.de", () => {
    const unicode = "faß.de";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--fa-hia.de");
  });

  test("βόλος.com", () => {
    const unicode = "βόλος.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--nxasmm1c.com");
  });

  test("ශ්‍රී.com", () => {
    const unicode = "ශ්‍රී.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--10cl1a0b660p.com");
  });

  test("نامه‌ای.com", () => {
    const unicode = "نامه‌ای.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--mgba3gch31f060k.com");
  });

  test("√.com", () => {
    const unicode = "√.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--19g.com");
  });

  test("googIe.com", () => {
    const unicode = "googIe.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("googie.com");
  });

  test("U+002E ( . ) FULL STOP", () => {
    const unicode = "example.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("example.com");
  });

  test("U+FF0E ( ． ) FULLWIDTH FULL STOP", () => {
    const unicode = "example．com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("example.com");
  });

  test("U+3002 ( 。 ) IDEOGRAPHIC FULL STOP", () => {
    const unicode = "example。com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("example.com");
  });

  test("U+FF61 ( ｡ ) HALFWIDTH IDEOGRAPHIC FULL STOP", () => {
    const unicode = "example｡com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("example.com");
  });

  test("all separators", () => {
    const unicode = "a.b．c。d｡e";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("a.b.c.d.e");
  });

  test("日本語。ＪＰ", () => {
    const unicode = "日本語。ＪＰ";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--wgv71a119e.jp");
  });
});

describe("Polish well known words", () => {
  test("żółć.pl", () => {
    const unicode = "żółć.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--kda4b0koi.pl");
  });

  test("ŻÓŁĆ.pl", () => {
    const unicode = "ŻÓŁĆ.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--kda4b0koi.pl");
  });

  test("źdźbło.pl", () => {
    const unicode = "źdźbło.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--dbo-iwa1zb.pl");
  });

  test("ŹDŹBŁO.pl", () => {
    const unicode = "ŹDŹBŁO.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--dbo-iwa1zb.pl");
  });

  test("łódź.pl", () => {
    const unicode = "łódź.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--d-uga0v4h.pl");
  });

  test("ŁÓDŹ.pl", () => {
    const unicode = "ŁÓDŹ.pl";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--d-uga0v4h.pl");
  });
});

// based on https://en.wikipedia.org/wiki/Emoji_domain#History
describe("emoji domains", () => {
  test("☻.com", () => {
    const unicode = "☻.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--84h.com");
  });

  test("♨.com", () => {
    const punycoded = "xn--j6h.com";

    const unicode1 = "♨.com";
    const ascii1 = domainToAscii(unicode1);
    expect(ascii1).toBe(punycoded);

    const unicode2 = "♨️.com";
    const ascii2 = domainToAscii(unicode2);
    expect(ascii2).toBe(punycoded);
  });

  test("☮.com", () => {
    const punycoded = "xn--v4h.com";

    const unicode1 = "☮.com";
    const ascii1 = domainToAscii(unicode1);
    expect(ascii1).toBe(punycoded);

    const unicode2 = "☮️.com";
    const ascii2 = domainToAscii(unicode2);
    expect(ascii2).toBe(punycoded);
  });

  test("♌.com", () => {
    const unicode = "♌️.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--q5h.com");
  });

  test("I♥You.com", () => {
    const unicode = "I♥You.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--iyou-5u3b.com");
  });

  test("I♥.com", () => {
    const unicode = "i♥.com";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--i-n3p.com");
  });

  test("💩.la", () => {
    const unicode = "💩.la";
    const ascii = domainToAscii(unicode);
    expect(ascii).toBe("xn--ls8h.la");
  });

  test("👁👄👁.fm", () => {
    const punycoded = "xn--mp8hai.fm";

    const unicode1 = "👁👄👁.fm";
    const ascii1 = domainToAscii(unicode1);
    expect(ascii1).toBe(punycoded);

    const unicode2 = "👁️👄👁️.fm";
    const ascii2 = domainToAscii(unicode2);
    expect(ascii2).toBe(punycoded);
  });
});

describe("punycodeEncode", () => {
  test("ascii", () => {
    const ascii = punycodeEncode("ascii");
    // yes, this is the expected output
    expect(ascii).toBe("ascii-");
  });

  test("a:b:c", () => {
    const ascii = punycodeEncode("a:b:c");
    expect(ascii).toBe("a:b:c-");
  });
});

describe("rfc3492", () => {
  test("Arabic (Egyptian)", () => {
    const unicode =
      "\u0644\u064A\u0647\u0645\u0627\u0628\u062A\u0643\u0644\u0645\u0648\u0634\u0639\u0631\u0628\u064A\u061F";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("egbpdaj6bu4bxfgehfvwxn");
  });

  test("Chinese (simplified)", () => {
    const unicode = "\u4ED6\u4EEC\u4E3A\u4EC0\u4E48\u4E0D\u8BF4\u4E2D\u6587";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("ihqwcrb4cv8a8dqg056pqjye");
  });

  test("Chinese (traditional)", () => {
    const unicode = "\u4ED6\u5011\u7232\u4EC0\u9EBD\u4E0D\u8AAA\u4E2D\u6587";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("ihqwctvzc91f659drss3x8bo0yb");
  });

  test("Czech", () => {
    const unicode = "Pro\u010Dprost\u011Bnemluv\xED\u010Desky";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("Proprostnemluvesky-uyb24dma41a");
  });

  test("Hebrew", () => {
    const unicode =
      "\u05DC\u05DE\u05D4\u05D4\u05DD\u05E4\u05E9\u05D5\u05D8\u05DC\u05D0\u05DE\u05D3\u05D1\u05E8\u05D9\u05DD\u05E2\u05D1\u05E8\u05D9\u05EA";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("4dbcagdahymbxekheh6e0a7fei0b");
  });

  test("Hindi (Devanagari)", () => {
    const unicode =
      "\u092F\u0939\u0932\u094B\u0917\u0939\u093F\u0928\u094D\u0926\u0940\u0915\u094D\u092F\u094B\u0902\u0928\u0939\u0940\u0902\u092C\u094B\u0932\u0938\u0915\u0924\u0947\u0939\u0948\u0902";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("i1baa7eci9glrd9b2ae1bj0hfcgg6iyaf8o0a1dig0cd");
  });

  test("Japanese (kanji and hiragana)", () => {
    const unicode =
      "\u306A\u305C\u307F\u3093\u306A\u65E5\u672C\u8A9E\u3092\u8A71\u3057\u3066\u304F\u308C\u306A\u3044\u306E\u304B";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("n8jok5ay5dzabd5bym9f0cm5685rrjetr6pdxa");
  });

  test("Korean (Hangul syllables)", () => {
    const unicode =
      "\uC138\uACC4\uC758\uBAA8\uB4E0\uC0AC\uB78C\uB4E4\uC774\uD55C\uAD6D\uC5B4\uB97C\uC774\uD574\uD55C\uB2E4\uBA74\uC5BC\uB9C8\uB098\uC88B\uC744\uAE4C";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe(
      "989aomsvi5e83db1d2a355cv1e0vak1dwrv93d5xbh15a0dt30a5jpsd879ccm6fea98c",
    );
  });

  test("Russian (Cyrillic)", () => {
    const unicode =
      "\u043F\u043E\u0447\u0435\u043C\u0443\u0436\u0435\u043E\u043D\u0438\u043D\u0435\u0433\u043E\u0432\u043E\u0440\u044F\u0442\u043F\u043E\u0440\u0443\u0441\u0441\u043A\u0438";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("b1abfaaepdrnnbgefbadotcwatmq2g4l");
  });

  test("Spanish", () => {
    const unicode = "Porqu\u00E9nopuedensimplementehablarenEspa\u00F1ol";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("PorqunopuedensimplementehablarenEspaol-fmd56a");
  });

  test("Vietnamese", () => {
    const unicode =
      "T\u1EA1isaoh\u1ECDkh\u00F4ngth\u1EC3ch\u1EC9n\u00F3iti\u1EBFngVi\u1EC7t";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("TisaohkhngthchnitingVit-kjcr8268qyxafd2f1b9g");
  });

  test("3<nen>B<gumi><kinpachi><sensei>", () => {
    const unicode = "3\u5E74B\u7D44\u91D1\u516B\u5148\u751F";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("3B-ww4c5e180e575a65lsy2b");
  });

  test("<amuro><namie>-with-SUPER-MONKEYS", () => {
    const unicode = "\u5B89\u5BA4\u5948\u7F8E\u6075-with-SUPER-MONKEYS";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("-with-SUPER-MONKEYS-pc58ag80a8qai00g7n9n");
  });

  test("Hello-Another-Way-<sorezore><no><basho>", () => {
    const unicode =
      "Hello-Another-Way-\u305D\u308C\u305E\u308C\u306E\u5834\u6240";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("Hello-Another-Way--fc4qua05auwb3674vfr0b");
  });

  test("<hitotsu><yane><no><shita>2", () => {
    const unicode = "\u3072\u3068\u3064\u5C4B\u6839\u306E\u4E0B2";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("2-u9tlzr9756bt3uc0v");
  });

  test("Maji<de>Koi<suru>5<byou><mae>", () => {
    const unicode = "Maji\u3067Koi\u3059\u308B5\u79D2\u524D";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("MajiKoi5-783gue6qz075azm5e");
  });

  test("<pafii>de<runba>", () => {
    const unicode = "\u30D1\u30D5\u30A3\u30FCde\u30EB\u30F3\u30D0";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("de-jg4avhby1noc0d");
  });

  test("<sono><supiido><de>", () => {
    const unicode = "\u305D\u306E\u30B9\u30D4\u30FC\u30C9\u3067";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("d9juau41awczczp");
  });

  test("-> $1.00 <-", () => {
    const unicode = "-> $1.00 <-";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("-> $1.00 <--");
  });
});

// https://en.wikipedia.org/wiki/Punycode#Examples
describe("Wikipedia examples", () => {
  test("No ASCII characters, one Cyrillic character.", () => {
    const unicode = "Б";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("d0a");
  });

  test("No ASCII characters, one Latin-1 Supplement character.", () => {
    const unicode = "ü";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("tda");
  });

  test("No ASCII characters, one Greek character.", () => {
    const unicode = "α";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("mxa");
  });

  test("No ASCII characters, one CJK character.", () => {
    const unicode = "例";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("fsq");
  });

  test("No ASCII characters, one CJK character.", () => {
    const unicode = "例";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("fsq");
  });

  test("No ASCII characters, one emoji character.", () => {
    const unicode = "😉";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("n28h");
  });

  test("No ASCII characters, more than one character.", () => {
    const unicode = "αβγ";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("mxacd");
  });

  test("Mixed string, with one character that is not an ASCII character.", () => {
    const unicode = "München";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("Mnchen-3ya");
  });

  test("Mixed string, with one character that is not ASCII, and a hyphen.", () => {
    const unicode = "München-Ost";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("Mnchen-Ost-9db");
  });

  test("Mixed string, with one space, one hyphen, and one character that is not ASCII.", () => {
    const unicode = "Bahnhof München-Ost";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("Bahnhof Mnchen-Ost-u6b");
  });

  test("Mixed string, two non-ASCII characters.", () => {
    const unicode = "abæcdöef";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("abcdef-qua4k");
  });

  test("Russian, without ASCII.", () => {
    const unicode = "правда";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("80aafi6cg");
  });

  test("Thai, without ASCII.", () => {
    const unicode = "ยจฆฟคฏข";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("22cdfh1b8fsa");
  });

  test("Korean, without ASCII.", () => {
    const unicode = "도메인";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("hq1bm8jm9l");
  });

  test("Japanese, without ASCII.", () => {
    const unicode = "ドメイン名例";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("eckwd4c7cu47r2wf");
  });

  test("Japanese with ASCII.", () => {
    const unicode = "MajiでKoiする5秒前";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("MajiKoi5-783gue6qz075azm5e");
  });

  test("Mixed non-ASCII scripts (Latin-1 Supplement and CJK).", () => {
    const unicode = "「bücher」";
    const ascii = punycodeEncode(unicode);
    expect(ascii).toBe("bcher-kva8445foa");
  });
});
