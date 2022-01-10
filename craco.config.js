const webpack = require("webpack");

module.exports = {
  webpack: {
    alias: {
      assert: "assert",
      buffer: "buffer",
      crypto: "crypto-browserify",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify/browser",
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
    configure: {
      experiments: {
        asyncWebAssembly: true,
      },
    },
  },
};
