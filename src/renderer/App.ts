import * as electron from 'electron'
import { Chart } from './Chart'

/** spacing of notes in pixels per second */
const noteSpacing = 100

const scrollSpeed = 10

const scrollDirection = -1

export class App {
  private canvas = document.getElementById('view') as HTMLCanvasElement
  private context = this.canvas.getContext('2d')!
  private chart = new Chart()

  private scrollOffset = 0

  constructor() {
    this.canvas.style.backgroundColor = 'black'

    window.addEventListener('resize', () => this.sizeViewToWindow())
    this.sizeViewToWindow()

    window.addEventListener('mousewheel', event => this.handleMouseWheel(event))
  }

  handleMouseWheel(event: WheelEvent) {
    this.scrollOffset -= event.deltaY / 100
    this.renderChart()
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
    this.renderChart()
  }

  private renderChart() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.save()

    this.context.translate(0, this.scrollOffset * noteSpacing)

    this.renderNotes()
    this.renderTimingPoints()

    this.context.restore()
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

      const text = tp.isInherited
        ? tp.scrollSpeed.toFixed(2) + 'x'
        : 60 / tp.secondsPerBeat + ''

      this.context.fillStyle = color

      this.context.fillRect(x, y, width, height)

      this.context.font = '16pt Roboto'
      this.context.textAlign = 'left'
      this.context.textBaseline = 'middle'

      this.context.fillText(text, x + width + 10, y)
    })
  }

  private sizeViewToWindow() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}
