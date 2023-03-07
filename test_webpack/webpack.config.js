module.exports = {
  // entry: `./src/index.js`,
  output: {
    // path: `${__dirname}/dist2`,
    filename: "main.js"
  },
  mode: "development",
  devServer: {
    static: "dist",
    open: true
  }
};