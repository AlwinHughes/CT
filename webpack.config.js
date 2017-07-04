const path = require('path');

module.exports = {
  entry: path.join(__dirname, './client/src/app.js'),

  output: {
    path: path.join(__dirname, './client/dist/js'),
    filename: 'app.js'
  },

  module: {
    loaders: [{
      test: /\.js?$/,
      include: path.join(__dirname, '/client/src'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015"]
      }
    }]
  },

  watch: true
}