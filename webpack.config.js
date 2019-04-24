const path = require('path');

module.exports = {
  entry: "./src/index",
  output: {
    // options related to how webpack emits results
    path: path.resolve(__dirname, "build"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)
    filename: "bundle.js", // string
    // the filename template for entry chunks
    publicPath: "/assets/", // string
    // the url to the output directory resolved relative to the HTML page
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(STL)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [],
  devServer: {
    contentBase: './src'
  }
};
