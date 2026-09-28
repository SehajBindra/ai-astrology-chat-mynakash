const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * `expo/metro-config` is available through expo-modules (see install-expo-modules)
 * and is required by Uniwind. Uniwind compiles Tailwind classes at build time.
 *
 * The RN CLI prints a "should extend @react-native/metro-config" warning for this
 * setup; expo/metro-config already extends it, so the warning is safe to ignore.
 */
const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './src/uniwind-types.d.ts',
});
