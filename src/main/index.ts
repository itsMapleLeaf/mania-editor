import { app, BrowserWindow, Menu } from 'electron'
import * as fs from 'fs'
import { resolve } from 'path'

let win: Electron.BrowserWindow

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.on('ready-to-show', () => {
    win.show()
  })
}

function createAppMenu() {
  const appMenu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          click: () => {
            win.webContents.send('open-dialog')
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => {
            app.quit()
          },
        },
      ],
    },
  ])

  Menu.setApplicationMenu(appMenu)
}

function setupDevMode() {
  if (process.argv.includes('--dev')) {
    console.info('Currently in dev mode')

    fs.watch(resolve(__dirname, 'renderer.bundle.js'), () => {
      win.reload()
    })

    win.webContents.openDevTools()
  }
}

function init() {
  createWindow()
  createAppMenu()
  setupDevMode()
}

app.on('ready', init)
