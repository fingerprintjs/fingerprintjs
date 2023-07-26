import { ConfigOptions } from 'webpack-cli'
import { Configuration as DevServer } from 'webpack-dev-server'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as TerserPlugin from 'terser-webpack-plugin'
import terserConfig from '../terser.config'

const configurationFactory: ConfigOptions = (_env, { mode = 'development' }) => ({
  entry: './index.ts',
  mode,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            sourceMap: true,
          },
        },
      },
      {
        test: /\.(jpe?g|png|svg|ico)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          name: '[name].[ext]?[contenthash]',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: terserConfig,
      }),
    ],
  },
  devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
  output: {
    clean: true,
    filename: '[name].js?[contenthash]',
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: 'all',
  } satisfies DevServer,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: `FingerprintJS ${mode === 'development' ? 'Playground' : 'Demo'}`,
    }),
  ],
  // https://stackoverflow.com/a/71739898/1118709
  // Correct (but not worth effort) solutions: build-time macros, custom JSON loader, Rollup instead of Webpack, riot
  ignoreWarnings: [/Should not import the named export 'version' .* from default-exporting module/],
})

export default configurationFactory
