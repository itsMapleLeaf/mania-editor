import * as electron from 'electron'
import { Chart } from './Chart'

/** spacing of notes in pixels per second */
const noteSpacing = 100

const scrollSpeed = 2

const scrollDirection = -1

export class App {
  private canvas = document.getElementById('view') as HTMLCanvasElement
  private context = this.canvas.getContext('2d')!
  private chart = new Chart()

  constructor() {
    this.canvas.style.backgroundColor = 'black'

    window.addEventListener('resize', () => this.sizeViewToWindow())
    this.sizeViewToWindow()
  }

  async showOpenDialog() {
    const files = electron.remote.dialog.showOpenDialog({
      filters: [{ name: 'osu! chart', extensions: ['osu'] }],
    })
    const chartPath = files ? files[0] : ''
    await this.loadChart(chartPath)
  }

  async loadChart(path: string) {
    this.chart = await Chart.loadFromFile(path)
    this.renderNotes()
    this.renderTimingPoints()
  }

  private renderNotes() {
    this.chart.notes.forEach(note => {
      const width = 64
      const height = 32
      const x = note.column * width
      const y =
        note.time * noteSpacing * scrollSpeed * scrollDirection +
        this.canvas.height -
        height

      this.context.fillStyle = 'white'
      this.context.fillRect(x, y, width, height)
    })
  }

  private renderTimingPoints() {
    this.chart.timingPoints.forEach(tp => {
      const width = 64 * 4
      const height = 2
      const x = 0
      const y =
        tp.offsetSeconds * noteSpacing * scrollSpeed * scrollDirection +
        this.canvas.height
      const color = tp.isInherited ? 'green' : 'red'

      this.context.fillStyle = color
      this.context.fillRect(x, y, width, height)
    })
  }

  private sizeViewToWindow() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}
