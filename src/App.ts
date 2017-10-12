import * as electron from 'electron'
import { Chart } from './Chart'
import { ChartRenderer } from './ChartRenderer'
import { store } from './store'

export class App {
  private canvas = document.getElementById('view') as HTMLCanvasElement
  private context = this.canvas.getContext('2d')!
  private chart = new Chart()
  private chartRenderer = new ChartRenderer(this.context, this.chart)

  constructor() {
    this.canvas.style.backgroundColor = 'black'

    window.addEventListener('resize', _ => this.handleWindowResize())
    window.addEventListener('mousewheel', event => this.handleMouseWheel(event))

    this.sizeViewToWindow()
  }

  init() {
    const lastBeatmap = store.lastBeatmap
    if (lastBeatmap) {
      this.loadChart(lastBeatmap)
    } else {
      this.showOpenDialog()
    }
  }

  async showOpenDialog() {
    const files = electron.remote.dialog.showOpenDialog({
      filters: [{ name: 'osu! chart', extensions: ['osu'] }],
    })
    const chartPath = files ? files[0] : ''
    await this.loadChart(chartPath)
  }

  private handleMouseWheel(event: WheelEvent) {
    this.chartRenderer.scrollOffset -= event.deltaY / 100
    this.chartRenderer.render()
  }

  private handleWindowResize() {
    this.sizeViewToWindow()
    this.chartRenderer.render()
  }

  private sizeViewToWindow() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  private async loadChart(path: string) {
    this.chart = await Chart.loadFromFile(path)
    this.chartRenderer.chart = this.chart
    store.lastBeatmap = path
    this.chartRenderer.render()
    console.log(this.chart.metadata)
  }
}
