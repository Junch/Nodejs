var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: [
        'babel-polyfill',
        './static/js/main.js',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080'
        ],
    output: {
        path: path.join(__dirname, 'static/dist/'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/dist'
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'static'),
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
    devServer: {
        port: 8080,
        contentBase: './static',
        hot: true,
        historyApiFallback: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:8081',
                secure: false
            }
        }
    }
};
