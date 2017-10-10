import * as HtmlPlugin from 'html-webpack-plugin'
import { resolve } from 'path'
import * as webpack from 'webpack'
import * as merge from 'webpack-merge'

const root = __dirname
const sourceFolder = resolve(root, 'src')
const buildFolder = resolve(root, 'build')

const tsLoader: webpack.LoaderRule = {
  test: /\.tsx?$/,
  loader: 'awesome-typescript-loader',
  options: {
    compilerOptions: {
      module: 'esnext',
    },
    silent: true,
  },
  include: [sourceFolder],
}

const baseConfig: webpack.Configuration = {
  context: root,
  output: {
    path: buildFolder,
  },
  module: {
    rules: [tsLoader],
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  plugins: [new webpack.NamedModulesPlugin()],
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: {
    react: `require('react')`,
    'react-dom': `require('react-dom')`,
    'pixi.js': `require('pixi.js')`,
  },
  devtool: 'eval-source-map',
}

const mainConfig = merge(baseConfig, {
  entry: resolve(sourceFolder, 'main'),
  output: {
    filename: 'main.bundle.js',
  },
  target: 'electron-main',
})

const rendererConfig = merge(baseConfig, {
  entry: resolve(sourceFolder, 'renderer'),
  output: {
    filename: 'renderer.bundle.js',
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlPlugin({
      template: resolve(sourceFolder, 'index.html'),
    }),
  ],
})

export default [mainConfig, rendererConfig]
