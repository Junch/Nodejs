var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var proxy = require('proxy-middleware');
var url = require('url');

module.exports = function(app) {
  app.use('/dist', proxy(url.parse('http://localhost:8080/dist')));

  var server = new WebpackDevServer(webpack(config), {
    contentBase: config.devServer.contentBase,
    hot: true,
    quiet: false,
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: { colors: true }
  }).listen(8080, '0.0.0.0', function() {
    console.log('socketio listen 8080')
  });
}
