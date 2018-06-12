const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  target: 'node',
  mode: 'production',
  entry: ['babel-polyfill', path.resolve('./api/index')],
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js',
  },
  resolve: {
    modules: [
      path.resolve('.'), // to resolve path 'server/', 'config/'
      path.resolve('./client'), // to resolve path liek '/components' on client
      'node_modules',
    ],
  },
  externals: nodeExternals(),
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              plugins: () => [
                autoprefixer
              ]
            },
          }
        ]
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|eot|ttf|otf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[path][name]_[hash:base64:5].[ext]' },
          },
        ],
      },
    ],
  },
  plugins: [
		new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('server'),
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(false),
				MONGO_DB_URI: JSON.stringify(process.env.MONGO_DB_URI ? process.env.MONGO_DB_URI : ''),
				VERSION: JSON.stringify(process.env.VERSION ? process.env.VERSION : ''),
				SECRET: JSON.stringify(process.env.SECRET ? process.env.SECRET : '')
      },
    })
  ],
};
