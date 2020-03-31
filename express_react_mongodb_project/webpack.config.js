var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

    entry: [
        'babel-polyfill',
        './src/index.js',
        './src/style.css'
    ],

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: ['babel-loader?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                })],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },

    resolve: { //React 프로젝트의 루트디렉토리를 설정
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false
                }
            })
        ]
    }
};
