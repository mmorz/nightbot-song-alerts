const base = require('./webpack.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');


base.mode = 'development';
base.devtool = 'inline-source-map';
base.plugins.push(
  new HtmlWebpackPlugin({
    template: './index.html',
    templateParameters: { googleAnalytics: '' }
  })
);

module.exports = base;
