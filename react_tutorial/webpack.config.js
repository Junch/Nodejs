var path = require('path');
var webpack = require('webpack');

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: [
		'babel-polyfill',
		'./main.js'
		],
	output: {path: __dirname, filename: 'bundle.js'},
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					plugins: ['transform-runtime'],
					presets: ['es2015', 'stage-0', 'react']
				}
			}
		]
	}
};
