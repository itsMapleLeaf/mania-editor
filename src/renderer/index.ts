import { ipcRenderer } from 'electron'
import { App } from './App'

const app = new App()
app.init()

ipcRenderer.on('open-dialog', () => {
  app.showOpenDialog()
})
