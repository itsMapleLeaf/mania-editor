import { App } from './App'
import { store } from './store'

const app = new App()
const lastBeatmap = store.get('lastBeatmap')

if (lastBeatmap) {
  app.loadChart(lastBeatmap)
} else {
  app.showOpenDialog()
}
