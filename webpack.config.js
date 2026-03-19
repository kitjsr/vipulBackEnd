const webpack = require('webpack');

module.exports = {
  // Your existing config
  resolve: {
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer/'),
      querystring: require.resolve('querystring-es3'),
      fs: false, // fs can't be polyfilled properly for frontend
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
};
