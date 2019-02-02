var base = require('./webpack.base');

base.mode = 'development';
base.devtool = 'inline-source-map';

module.exports = base;
