// https://docs.expo.dev/guides/using-eslint/
const { EndOfLineState } = require('typescript');

module.exports = {
  root: true,
  extends: ["expo", "@react-native", "prettier"],
  plugins: ['prettier'],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      },
    ]
  }
};