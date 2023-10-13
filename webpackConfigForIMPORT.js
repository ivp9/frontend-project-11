// Generated using webpack-cli https://github.com/webpack/webpack-cli

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    open: true,
    host: 'localhost',
  },
  entry: './src/js/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
