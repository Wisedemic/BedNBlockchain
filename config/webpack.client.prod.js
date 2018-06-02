const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'source-map',
  target: 'web',
  mode: 'production',
  entry: ['babel-polyfill', path.resolve('./client/index.js')],
  output: {
    path: path.resolve('./dist/'),
    filename: 'client.js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve('./client'), // to resolve path liek '/components' on client
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
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
        test: /\.(png|jpg|jpeg|gif|woff|woff2|svg|eot|ttf|otf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]_[hash:base64:5].[ext]',
            },
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
        NODE_ENV: JSON.stringify('production'),
				VERSION: JSON.stringify(process.env.VERSION ? process.env.VERSION : ''),
      },
    })
  ],
}
