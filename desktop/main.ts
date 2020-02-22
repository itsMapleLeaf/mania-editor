import { app, BrowserWindow, Menu } from "electron"
import { join } from "path"

const projectRoot = join(__dirname, "..")
const buildFolder = join(projectRoot, "build")
const devServerUrl = "http://localhost:3000"

let win: BrowserWindow | undefined

app.allowRendererProcessReuse = true

app.on("ready", () => {
  Menu.setApplicationMenu(null)

  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })

  if (process.env.NODE_ENV === "development") {
    win.loadURL(devServerUrl).catch(console.error)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(buildFolder, "index.html")).catch(console.error)
  }
})

app.on("will-quit", () => {
  win = undefined
})
