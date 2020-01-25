const process = require('process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('./webpack.base');


const { SONG_ALERT_UAID, SENTRY_DSN } = process.env;

if (!SONG_ALERT_UAID) {
  throw new Error('SONG_ALERT_UAID missing');
}

if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN missing');
}

const googleAnalytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=${SONG_ALERT_UAID}"></script><script>window.dataLayer=window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag('js', new Date()); gtag('config', '${SONG_ALERT_UAID}');</script>`

base.mode = 'production';
base.plugins.push(
  new HtmlWebpackPlugin({
    template: './index.html',
    templateParameters: { googleAnalytics }
  })
);
base.plugins.push(new webpack.DefinePlugin(['SENTRY_DSN']));
base.output = { filename: '[name].[contenthash].js' };

module.exports = base;
