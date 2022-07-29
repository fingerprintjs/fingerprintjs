import type { ConfigurationFactory } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as TerserPlugin from 'terser-webpack-plugin'
import terserConfig from '../terser.config'

const configurationFactory: ConfigurationFactory = (_env, { mode = 'development' }) => ({
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
          configFile: '../tsconfig.json', // The `./tsconfig.json` file is made for the webpack.config.ts file itself
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
    filename: '[name].js?[contenthash]',
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: `FingerprintJS Open Source ${mode === 'development' ? 'Playground' : 'Demo'}`,
    }),
  ],
})

export default configurationFactory
