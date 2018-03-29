const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSCSS = new ExtractTextPlugin({
  filename: "app.bundle.css"
});

module.exports = {
  // mode: "development",
  entry: ["./example/client/App.jsx", "./styles/styles.scss"],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist/",
    hot: false
  },
  output: {
    filename: "webpack-bundle.js",
    path: path.join(__dirname, "./dist/")
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react", "stage-0"]
          }
        }
      },
      { test: /\.flow$/, loader: "ignore-loader" },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
            use: [{
              loader: "css-loader", options: {
                sourceMap: true,
                importLoaders: 1
              }
            }, {
              loader: 'postcss-loader', options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [ require('autoprefixer')() ]
              }
            },{
              loader: "sass-loader", options: {
                sourceMap: true
              }
            }],
            fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
    extractSCSS
    // new OptimizeCssAssetsPlugin({
    //   cssProcessor: require("cssnano"),
    //   cssProcessorOptions: { discardComments: { removeAll: true } },
    //   canPrint: true
    // })
  ]
};
