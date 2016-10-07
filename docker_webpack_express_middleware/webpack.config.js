var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'public/main.jsx')
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/dist',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders:[
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'public'),
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["react", "es2015", "react-hmre"]
        }
      },
      { test: /\.css$/,
        loader: 'style-loader!css-loader?modules' 
      }
    ]
  }
};
