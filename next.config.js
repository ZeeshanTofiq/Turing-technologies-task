const withLess = require("next-with-less");
const withYAML = require("next-yaml");
module.exports = withYAML(
  withLess({
    // reactStrictMode: true,
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {},
      },
    },

    images: {
      domains: ["images.pexels.com", "cdn.pixabay.com"],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      });
      return config;
    },
  })
);
