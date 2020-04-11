'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const packageJson = require('./package.json')

module.exports = (_, argv) => {
  const prod = argv.mode === 'production'
  const chunkhash = prod ? '.[chunkhash]' : ''
  return {
    name: 'word-search',
    devtool: prod ? 'hidden-sorce-map' : 'eval-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
    },
    entry: {
      'word-search': ['react-hot-loader/patch', './components'],
    },
    target: 'web',
    output: {
      path: path.resolve('./dist'),
      filename: `word-search${chunkhash}.js`,
    },
    optimization: {
      splitChunks: { chunks: 'all' },
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.css', '.json'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !prod,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                modules: {
                  localIdentName: prod
                    ? '[hash:base64:5]'
                    : '[path][name]__[local]--[hash:base64:5]',
                },
                localsConvention: 'camelCase',
                importLoaders: 1,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        APP_VERSION: JSON.stringify(packageJson.version),
        NODE_ENV: JSON.stringify('development'),
      }),
      new HtmlWebpackPlugin({
        template: './html/index.html',
        filename: './index.html',
        minify: {
          collapseWhitespace: prod,
        },
      }),
      new MiniCssExtractPlugin({
        filename: `[name]${chunkhash}.css`,
        chunkFilename: `[id]${chunkhash}.css`,
      }),
      new OfflinePlugin({
        ServiceWorker: {
          minify: prod,
          events: true,
        },
      }),
    ],
  }
}
