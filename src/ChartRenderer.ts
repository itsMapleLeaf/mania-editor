import { Chart } from './Chart'

/** spacing of notes in pixels per second */
const noteSpacing = 100

const scrollSpeed = 10

const scrollDirection = -1

export class ChartRenderer {
  scrollOffset = 0

  constructor(private context: CanvasRenderingContext2D, public chart: Chart) {}

  render() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    )

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
        this.context.canvas.height -
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
        this.context.canvas.height

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

    const { Metadata } = this.chart.metadata

    if (Metadata) {
      const { Artist, Title, Version } = Metadata
      const text = `${Artist} - ${Title} [${Version}]`
      this.context.fillText(text, 10, 10)
    }
  }
}
