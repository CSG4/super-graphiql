const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

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
    loaders: [
      {
        test: /.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react", "stage-0"]
        }
      }
      //,
      // {
      //     test: /\.scss$/,
      //     loader: [
      //         "style-loader", // creates style nodes from JS strings
      //         "css-loader", // translates CSS into CommonJS
      //         "sass-loader" // compiles Sass to CSS
      //     ]
      // }
    ]
  }
};
