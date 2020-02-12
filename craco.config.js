module.exports = {
  webpack: {
    configure: {
      target: "electron-renderer",
    },
  },
  babel: {
    presets: ["@emotion/css-prop"],
  },
}
