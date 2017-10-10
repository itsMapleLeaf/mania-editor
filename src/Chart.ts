import * as fs from 'fs'
import { promisify } from 'util'

type Note = {
  time: number
  column: number
  length: number
}

type TimingPoint = {
  offsetSeconds: number
  secondsPerBeat: number
  scrollSpeed: number
  meter: number
  sampleType: number
  sampleSet: number
  volume: number
  isInherited: boolean
  isKiai: boolean
}

const readFile = promisify(fs.readFile)

const endLinePattern = /[\r\n]+/
const sectionPattern = /\[([a-z]+)\]/i
const commaPattern = /\s*,\s*/
const keyValuePattern = /([a-z]+)\s*:\s*(.*)/i

/** A representation of an .osu file */
export class Chart {
  timingPoints = [] as TimingPoint[]
  notes = [] as Note[]
  metadata = {} as any

  static async loadFromFile(path: string) {
    const content = (await readFile(path)).toString()

    const lines = content
      .split(endLinePattern)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    let currentSection = ''
    let keyCount = 0

    const chart = new Chart()

    lines.forEach(line => {
      const sectionMatch = line.match(sectionPattern)
      if (sectionMatch) {
        const section = sectionMatch[1]
        currentSection = section
        chart.metadata[section] = {}
        return
      }

      if (currentSection === 'TimingPoints') {
        const values = line.split(commaPattern).map(Number)
        const lastTimingPoint =
          chart.timingPoints[chart.timingPoints.length - 1]

        const isInherited = values[6] === 0

        const scrollSpeed = isInherited ? 1 / (values[1] * -1 * 0.01) : 1

        const secondsPerBeat = isInherited
          ? lastTimingPoint.secondsPerBeat
          : values[1] / 1000

        chart.timingPoints.push({
          secondsPerBeat,
          scrollSpeed,
          isInherited,
          offsetSeconds: values[0] / 1000,
          meter: values[2],
          sampleType: values[3],
          sampleSet: values[4],
          volume: values[5],
          isKiai: values[7] === 1,
        })
      } else if (currentSection === 'HitObjects') {
        const values = line.split(commaPattern)

        const columnWidth = 512 / keyCount
        const column = (+values[0] - columnWidth / 2) / columnWidth
        const time = +values[2] / 1000
        const holdEnd = parseInt(values[5], 10) / 1000
        const holdLength = holdEnd === 0 ? 0 : holdEnd - time

        chart.notes.push({
          column,
          time,
          length: holdLength,
        })
      } else {
        const keyValueMatch = line.match(keyValuePattern)
        if (keyValueMatch) {
          const [, key, value] = keyValueMatch
          chart.metadata[currentSection][key] = value

          if (currentSection === 'Difficulty' && key === 'CircleSize') {
            keyCount = +value
          }
        }
      }
    })

    return chart
  }
}
