var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './public/main.jsx',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://0.0.0.0:8080'
    ],
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders:[
      { test: /\.js[x]?$/,
        include: path.join(__dirname, 'public'),
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
      { test: /\.css$/,
        loader: 'style-loader!css-loader?modules' 
      }
    ]
  },
  devServer: {
    port: 8080,
    contentBase: 'public',
    inline: true,
    historyApiFallback: true,
    proxy: {
        '/api/*': {
            target: 'http://localhost:9090',
            secure: false
        }
    },
    host: '0.0.0.0'
  }
};
