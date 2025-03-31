const headers = require("./headers");
const next_config = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
  env: {
    APP_ENV: process.env.NODE_ENV,
    APP_SSL: process.env.NEXT_PUBLIC_APP_SSL,
  },
};

module.exports = next_config;
