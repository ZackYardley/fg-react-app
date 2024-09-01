// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: ["expo"],
  // extends: ["expo", "prettier"],
  // plugins: ["prettier"],
  // rules: {
  //   "prettier/prettier": [
  //     "error",
  //     {
  //       endOfLine: "auto",
  //     },
  //   ],
  // },
  ignorePatterns: ["functions/**/*"], // Ignore the functions directory
};
