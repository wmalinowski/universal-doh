// TODO:
// - DNSSEC
// - CORS

export const CLOUDFLARE = [
  // https://developers.cloudflare.com/1.1.1.1/setup/

  // no filtering - no ECS

  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.1.1.1",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.0.0.1",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1111]",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1001]",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },

  // malware filter - no ECS

  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.1.1.2",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.0.0.2",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1112]",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1002]",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },

  // malware and family filter - no ECS

  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.1.1.3",
    ecs: false,
    malwareFilter: true,
    familyFilter: true,
  },
  {
    provider: "Cloudflare",
    ipVersion: 4,
    url: "https://1.0.0.3",
    ecs: false,
    malwareFilter: true,
    familyFilter: true,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1113]",
    ecs: false,
    malwareFilter: true,
    familyFilter: true,
  },
  {
    provider: "Cloudflare",
    ipVersion: 6,
    url: "https://[2606:4700:4700::1003]",
    ecs: false,
    malwareFilter: true,
    familyFilter: true,
  },
];

export const GOOGLE = [
  // https://developers.google.com/speed/public-dns/docs/using

  // no filtering + ECS support

  {
    provider: "Google",
    ipVersion: 4,
    url: "https://8.8.8.8",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Google",
    ipVersion: 4,
    url: "https://8.8.4.4",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Google",
    ipVersion: 6,
    url: "https://[2001:4860:4860::8888]",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Google",
    ipVersion: 6,
    url: "https://[2001:4860:4860::8844]",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
];

export const QUAD9 = [
  // https://quad9.net/service/service-addresses-and-features

  // no filtering, no DNSSEC validation - no ECS support

  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.10",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.10:5053",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.10",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.10:5053",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::10]",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::10]:5053",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:10]",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:10]:5053",
    ecs: false,
    malwareFilter: false,
    familyFilter: false,
  },

  // no filtering, no DNSSEC validation + ECS support

  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.12",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.12:5053",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.12",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.12:5053",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::12]",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::12]:5053",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:12]",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:12]:5053",
    ecs: true,
    malwareFilter: false,
    familyFilter: false,
  },

  // malware filter - no ECS

  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.9",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.9:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.9",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.9:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.112",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.112:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe]",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe]:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::9]",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::9]:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:9]",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:9]:5053",
    ecs: false,
    malwareFilter: true,
    familyFilter: false,
  },

  // malware filter + ECS

  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.11",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://9.9.9.11:5053",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.11",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 4,
    url: "https://149.112.112.11:5053",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::11]",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::11]:5053",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:11]",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
  {
    provider: "Quad9",
    ipVersion: 6,
    url: "https://[2620:fe::fe:11]:5053",
    ecs: true,
    malwareFilter: true,
    familyFilter: false,
  },
];

export const ALL = CLOUDFLARE.concat(GOOGLE).concat(QUAD9);
