import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import { resolve } from 'path'

let win: Electron.BrowserWindow

app.on('ready', () => {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('ready-to-show', () => {
    win.show()
  })

  if (process.argv.includes('--dev')) {
    console.info('Currently in dev mode')

    fs.watch(resolve(__dirname, 'renderer.bundle.js'), () => {
      win.reload()
    })
  }
})
