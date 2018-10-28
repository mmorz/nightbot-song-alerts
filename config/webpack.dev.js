var base = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin');

base.mode = 'development';
base.devtool = 'cheap-module-eval-source-map';
base.plugins = [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),
];

module.exports = base;
