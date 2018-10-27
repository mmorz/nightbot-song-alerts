module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    ["extensible-destructuring", { mode: "optout", impl: "immutable" }],
    "@babel/plugin-proposal-class-properties"
  ]
};
