var path = require('path');

module.exports = {
  entry: './public/main.jsx',
  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
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
    host: '0.0.0.0'
  }
};
