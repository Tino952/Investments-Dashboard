const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { merge } = require("webpack-merge");


const commonConfig = {
  entry: './client/index.js',
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader"
          },
          {
              test: /\.scss/,
              use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
          }
      ]
  },
    optimization: {
      minimizer: [
        new TerserPlugin(),new CssMinimizerPlugin()
      ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./client/index.html",
            filename: "./index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ]
  };

const prodConfig = {
  mode: 'production',
  output: {
    libraryTarget: "var",
    library: "Client",
    // this eliminates the need for the clean webpack plugin
    clean: true,
  },
};

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  stats: 'verbose',
  optimization: {
    minimize: true,
  },

};

module.exports = (env, arg) =>  {
  switch(arg.mode) {
    case "development":
      return merge(commonConfig, devConfig);
    case "production":
      return merge(commonConfig, prodConfig);
    default:
      throw new Error("no matching configuration found")
  }
}
