const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite o expo-sqlite rodar também na versão web (arquivo .wasm).
config.resolver.assetExts.push('wasm');

module.exports = config;
