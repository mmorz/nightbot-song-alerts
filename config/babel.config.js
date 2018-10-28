module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['extensible-destructuring', { mode: 'optout', impl: 'immutable' }],
    '@babel/plugin-proposal-class-properties',
  ],
};
