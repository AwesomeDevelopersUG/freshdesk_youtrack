var path = require("path");
var webpack = require("webpack");
var PathRewriterPlugin = require('webpack-path-rewriter');

// The config object
var config = {
    cache: true,
    entry: {
        app: './src/app'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.js'
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(png|jpg|gif|json|mp4|webm)/,
                loader: 'file-loader?name=[hash:hex].[ext]'
            },
            {
                test: /\.(woff|eot|svg|ttf)/,
                loader: 'file-loader?name=[hash:hex].[ext]'
            },
            {   test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react', 'stage-1']
                }
            }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src'),
        extensions: ["", ".js", '.css'],
        modulesDirectories: [
            'node_modules',
            'bower_components'
        ],
        alias: {
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new PathRewriterPlugin(),
        new webpack.optimize.UglifyJsPlugin(
           {compress: {warnings: false}, output: {comments: false}}
        )
    ]
};

module.exports = config;
