import * as electron from 'electron'
import * as pixi from 'pixi.js'
import { Chart } from './Chart'

/** spacing of notes in pixels per second */
const noteSpacing = 100

const scrollSpeed = 5

const scrollDirection = -1

class ManiaNote {
  sprite = new pixi.Graphics()

  constructor(public column: number, public time: number) {
    this.sprite.beginFill(0xffffff)
    this.sprite.drawRect(0, 0, 64, 32)
    this.sprite.endFill()

    this.sprite.x = column * this.sprite.width
    this.sprite.y = time * (noteSpacing * scrollSpeed) * scrollDirection
  }
}

class App {
  app = new pixi.Application({
    view: document.getElementById('view') as HTMLCanvasElement,
    width: 1280,
    height: 720,
    autoStart: false,
  })

  chart = new Chart()

  notes = [] as ManiaNote[]
  noteContainer = new pixi.Container()

  constructor() {
    this.noteContainer.y = this.app.renderer.height

    this.app.stage.addChild(this.noteContainer)

    this.app.ticker.add(dt => this.update(dt))

    window.addEventListener('resize', () => this.sizeViewToWindow(), true)
    this.sizeViewToWindow()
  }

  start() {
    this.app.start()
  }

  update(dt: number) {}

  async showOpenDialog() {
    const files = electron.remote.dialog.showOpenDialog({
      filters: [{ name: 'osu! chart', extensions: ['osu'] }],
    })
    const chartPath = files ? files[0] : ''
    await this.loadChart(chartPath)
  }

  async loadChart(path: string) {
    this.chart = await Chart.loadFromFile(path)
    this.createNotes(this.chart)
  }

  private createNotes(chart: Chart) {
    chart.hitObjects.forEach(hitObject => {
      const column = (hitObject.x - 64) / 128
      const timeSeconds = hitObject.time / 1000
      const note = new ManiaNote(column, timeSeconds)
      this.notes.push(note)
      this.noteContainer.addChild(note.sprite)
    })
  }

  private sizeViewToWindow() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight)
  }
}

const app = new App()
app.start()
app.loadChart(
  'd:\\osu!\\Songs\\562394 saradisk - 220 - Kumano\\saradisk - 220 - Kumano (JesusMD24) [Insane].osu',
)
// app.showOpenDialog()
