import * as electron from 'electron'
import { Chart } from './Chart'
import { store } from './store'

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
    this.scrollOffset -= event.deltaY / 100
    this.render()
  }

  private handleWindowResize() {
    this.sizeViewToWindow()
    this.render()
  }

  private sizeViewToWindow() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  private async loadChart(path: string) {
    this.chart = await Chart.loadFromFile(path)
    store.lastBeatmap = path
    this.render()
    console.log(this.chart.metadata)
  }

  private render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.context.save()

    this.context.translate(0, this.scrollOffset * noteSpacing)

    this.renderNotes()
    this.renderTimingPoints()

    this.context.restore()

    this.renderChartInfo()
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

      const holdLength = note.length * noteSpacing * scrollSpeed - height

      this.context.fillStyle = 'rgba(255, 255, 255, 0.5)'
      this.context.fillRect(x, y, width, -holdLength)

      this.context.fillStyle = 'rgba(255, 255, 255, 1)'
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
        : (60 / tp.secondsPerBeat).toFixed(2) + ''

      this.context.fillStyle = color

      this.context.fillRect(x, y, width, height)

      this.context.font = '16pt Roboto'
      this.context.textAlign = 'left'
      this.context.textBaseline = 'middle'

      this.context.fillText(text, x + width + 10, y)
    })
  }

  private renderChartInfo() {
    this.context.fillStyle = 'white'
    this.context.font = '16pt Roboto'
    this.context.textAlign = 'left'
    this.context.textBaseline = 'top'

    const { Title, Artist, Version } = this.chart.metadata.Metadata

    const text = `${Artist} - ${Title} [${Version}]`

    this.context.fillText(text, 10, 10)
  }
}
