import * as childProcess from 'child_process'
import * as fs from 'fs'
import { resolve } from 'path'
import * as webpack from 'webpack'

const webpackConfig = require('../webpack.config').default
const electronPath = require<string>('electron')

const root = resolve(__dirname, '..')

const compiler = webpack(webpackConfig)

let electronProcess: childProcess.ChildProcess

function runElectron() {
  if (electronProcess) electronProcess.kill('SIGINT')
  electronProcess = childProcess.spawn(electronPath, [root, '--dev'])
  electronProcess.stdout.pipe(process.stdout)
  electronProcess.stderr.pipe(process.stderr)
}

compiler.watch({}, (err, stats) => {
  if (err) throw err

  if (stats.hasErrors() || stats.hasWarnings()) {
    console.info(stats.toString({ colors: true }))
  }
})

fs.watch(resolve(root, 'build/main.bundle.js'), runElectron)
