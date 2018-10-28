var base = require('./webpack.base');
var HtmlWebpackPlugin = require('html-webpack-plugin');

base.mode = 'production';
base.plugins = [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),
];


module.exports = base;
