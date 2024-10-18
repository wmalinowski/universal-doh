export function domainToAscii(domain: string) {
  const preprocessed = preprocessDomain(domain);
  const labels = preprocessed.split(".");

  const asciiLabels = labels.map((label) => {
    if (stringIsAscii(label)) {
      return label;
    } else {
      return "xn--" + punycodeEncode(label);
    }
  });

  return asciiLabels.join(".").toLowerCase();
}

function preprocessDomain(domain: string) {
  // https://unicode.org/reports/tr46/#TableDerivationStep1
  const exceptionalMapped = domain
    .replace(/[．。｡]/gu, ".")
    .replace(/ẞ/gu, "ß");

  // we normalize the input to Unicode Normalization Form KC
  const normalized = exceptionalMapped.normalize("NFKC");

  // TODO: we deviate from the spec here to simplify the implementation
  //       this may need to be revisited in the future

  // we should perform case folding here (NFKC_Casefold)
  // but we simplify this step to just lowercase the input instead
  const lowercased = normalized.toLowerCase();

  // remove all code points in the range U+FE00 to U+FE0F
  // (Unicode variation selectors) from the input
  // as they break emoji domains handling
  const filtered = lowercased.replace(/[\uFE00-\uFE0F]/gu, "");

  return filtered;
}

function stringIsAscii(str: string): boolean {
  return Array.from(str).every(charIsAscii);
}

function charIsAscii(char: string): boolean {
  return char.charCodeAt(0) < 128;
}

const base = 36;
const tmin = 1;
const tmax = 26;
const skew = 38;
const damp = 700;
const initial_bias = 72;
const initial_n = 0x80;

export function punycodeEncode(str: string) {
  let n = initial_n;
  let delta = 0;
  let bias = initial_bias;
  const output: string[] = [];

  const inputChars = Array.from(str);

  // copy ascii chars to output
  const asciiChars = inputChars.filter(charIsAscii);
  const basicCodePoints = asciiChars.length;
  let handledCodePoints = basicCodePoints;
  output.push(...asciiChars);

  // append delimiter if we consumed any ascii chars
  if (basicCodePoints > 0) {
    output.push("-");
  }

  const inputCodePoints = inputChars.map((char) => char.codePointAt(0)!);
  const inputLength = inputCodePoints.length;

  while (handledCodePoints < inputLength) {
    // Find the minimum code point >= n
    let m = Number.MAX_SAFE_INTEGER;
    for (const c of inputCodePoints) {
      if (c >= n && c < m) {
        m = c;
      }
    }

    delta += (m - n) * (handledCodePoints + 1);
    n = m;

    for (const c of inputCodePoints) {
      if (c < n) {
        delta++;
      } else if (c === n) {
        let q = delta;
        let k = base;

        while (true) {
          let t: number;
          if (k <= bias) {
            t = tmin;
          } else if (k >= bias + tmax) {
            t = tmax;
          } else {
            t = k - bias;
          }
          if (q < t) break;
          const code = t + ((q - t) % (base - t));
          output.push(encodeDigit(code));
          q = div(q - t, base - t);
          k += base;
        }

        output.push(encodeDigit(q));
        bias = adaptBias(
          delta,
          handledCodePoints + 1,
          handledCodePoints === basicCodePoints,
        );
        delta = 0;
        handledCodePoints++;
      }
    }

    delta++;
    n++;
  }

  return output.join("");
}

function encodeDigit(d: number): string {
  return String.fromCharCode(d + 22 + 75 * Number(d < 26));
}

function div(n: number, d: number) {
  return Math.floor(n / d);
}

function adaptBias(delta: number, numPoints: number, firstTime: boolean) {
  if (firstTime) {
    delta = div(delta, damp);
  } else {
    delta = div(delta, 2);
  }

  delta += div(delta, numPoints);

  let k = 0;
  while (delta > div((base - tmin) * tmax, 2)) {
    delta = div(delta, base - tmin);

    k += 36;
  }

  return k + div((36 - 1 + 1) * delta, delta + skew);
}
