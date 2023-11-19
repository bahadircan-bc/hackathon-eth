const { override } = require('customize-cra');

function addFallback(config) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve.fallback,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url/'),
      zlib: require.resolve('browserify-zlib'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
    },
  };
  return config;
}

module.exports = override(addFallback);