const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin("app.bundle.css");

module.exports = {
  entry: "./example/client/App.jsx",
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader"]
        })
      }
    ]
  },
  plugins: [
    extractCSS,
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    })
  ]
};
