const path = require('path');
const HandlebarsPlugin = require('handlebars-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const cssnano = require('cssnano');
const Dotenv = require('dotenv-webpack')

const { makeDataReplacements, registerHandlersHelpers } = require('./webpack.helpers.js');

const mode = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

const sourceDir = path.join(__dirname, 'src');
const templateDir = path.join(__dirname, 'generated');
const buildDir = path.join(__dirname, 'build');

const isProd = mode === 'production';
const prodPlugins = [new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })];

module.exports = {
  mode,
  entry: path.join(sourceDir, 'entry.js'),
  output: {
    path: buildDir,
    filename: isProd ? 'bundle.[chunkhash].js' : 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProd,
            },
          },
          { loader: 'css-loader', options: { importLoaders: 1 } },
          isProd
            ? {
                loader: 'postcss-loader',
                options: { ident: 'postcss', plugins: () => [postcssPresetEnv(), cssnano()] },
              }
            : null,
          {
            loader: 'sass-loader',
          },
        ].filter(Boolean),
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: 'fonts/[name].[ext]' },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            // Use the ignore loader because we manually copy image assets using the copy plugin
            // loader: 'ignore-loader',
            loader: 'file-loader',
            options: {
              name: '[folder]/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env', // Path to .env file (this is the default)
      safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourceDir, 'views', 'layout', 'template.hbs'),
      filename: path.join(templateDir, 'template.hbs'),
      inject: false,
    }),
    new HandlebarsPlugin({
      htmlWebpackPlugin: {
        enabled: true,
        prefix: 'html',
      },
      entry: path.join(sourceDir, 'views', '*.hbs'),
      output: (name) => {
        const page = name !== 'index' ? name : '';
        return path.join(buildDir, page, 'index.html');
      },
      data: path.join(sourceDir, 'data', '*.json'),
      partials: [
        path.join(templateDir, 'template.hbs'),
        path.join(sourceDir, 'views', 'partials', '*.hbs'),
        path.join(sourceDir, 'views', 'partials', 'sections', '*.hbs'),
      ],
      onBeforeSetup: (Handlebars) => {
        return registerHandlersHelpers(Handlebars);
      },
      onBeforeRender: (Handlebars, data) => {
        return makeDataReplacements(data);
      },
    }),
    new CopyWebpackPlugin(
      [
        {
          from: path.join(sourceDir, 'img/company-logos'),
          to: 'img/company-logos',
        },
      ],
      {
        ignore: ['.DS_Store'],
      },
    ),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[chunkhash].css' : '[name].css',
      chunkFilename: '[id].css',
      fallback: 'style-loader',
      use: [{ loader: 'css-loader', options: { minimize: isProd } }],
    }),
  ].concat(isProd ? prodPlugins : []),
  devServer: {
    contentBase: buildDir,
    open: false,
    port: PORT,
  },
  stats: {
    assets: true,
    children: false,
    colors: true,
    entrypoints: false,
    hash: false,
    modules: false,
    version: false,
  },
};
