var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './public/main.jsx',
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
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
  }
};
