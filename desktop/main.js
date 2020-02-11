// @ts-check
const { app, BrowserWindow, session } = require("electron")
const { join } = require("path")
const { watch } = require("fs")

const projectRoot = join(__dirname, "..")
const buildFolder = join(projectRoot, "build")
const devServerUrl = "http://localhost:3000"

/** @type {BrowserWindow | null} */
let win = null

app.allowRendererProcessReuse = true

app.on("ready", () => {
  win = new BrowserWindow({
    // todo?
  })

  if (process.argv.includes("--dev")) {
    win.loadURL(devServerUrl).catch(console.error)
  } else {
    win.loadFile(join(buildFolder, "index.html")).catch(console.error)
  }
})

app.on("will-quit", () => {
  win = null
})
