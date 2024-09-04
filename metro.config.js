// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs", "md", "mdx");

config.transformer.babelTransformerPath = require.resolve("./transformer.js");

module.exports = config;