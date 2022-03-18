const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

// eslint-disable-next-line func-names
module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  config.resolve.alias = {
    react: path.resolve('./node_modules/react'),
  };
  return config;
};
