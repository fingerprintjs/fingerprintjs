const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = (env, { mode = 'development' }) => ({
  entry: './index.ts',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: require('../terser.config.js'),
      }),
    ],
  },
  devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
  devServer: {
    host: '0.0.0.0',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: `FingerprintJS ${mode === 'development' ? 'Playground' : 'Demo'}`,
    }),
  ],
})
