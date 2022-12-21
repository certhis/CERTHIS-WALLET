const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    main: path.resolve( './test/test.js'),
  },
  plugins: [
   
      new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    })

],
  mode: 'development',


  resolve: {
   fallback: {
         "process/browser": require.resolve('process/browser'),
    "fs": false,
    "tls": false,
    "net": false,
    "path": false,
    "zlib": false,
    "http": false,
    "https": false,
    "stream": false,
    "crypto": false,
    'assert': false,
    "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
  } }
  ,
   output: {
    path: path.resolve('./test'),
    filename: 'test.comp.js',
     libraryTarget: 'window'
  },
   performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
}
}