import * as fs from 'fs'
import { promisify } from 'util'

type Note = {
  time: number
  column: number
  length: number
}

type HitObjectType = 'tap' | 'long-note' | 'unknown'

type TimingPoint = {
  offsetSeconds: number
  secondsPerBeat: number
  meter: number
  sampleType: number
  sampleSet: number
  volume: number
  isInherited: boolean
  isKiai: boolean
}

const readFile = promisify(fs.readFile)

const sectionPattern = /\[([a-z]+)\]/i

/** A representation of an .osu file */
export class Chart {
  timingPoints = [] as TimingPoint[]
  notes = [] as Note[]

  static async loadFromFile(path: string) {
    const content = (await readFile(path)).toString()

    const lines = content
      .split(/[\r\n]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    let currentSection = ''

    const chart = new Chart()

    lines.forEach(line => {
      const sectionMatch = line.match(sectionPattern)
      if (sectionMatch) {
        currentSection = sectionMatch[1]
        return
      }

      if (currentSection === 'TimingPoints') {
        const values = line.split(/\s*,\s*/).map(Number)

        chart.timingPoints.push({
          offsetSeconds: values[0] / 1000,
          secondsPerBeat: values[1] / 1000,
          meter: values[2],
          sampleType: values[3],
          sampleSet: values[4],
          volume: values[5],
          isInherited: values[6] === 0,
          isKiai: values[7] === 1,
        })
      }

      if (currentSection === 'HitObjects') {
        const values = line.split(/\s*,\s*/)

        const bitTap = 0b00000001
        const bitLongNote = 0b10000000

        const objectTypeMask = +values[3]

        let objectType: HitObjectType = 'unknown'
        if ((objectTypeMask & bitTap) > 0) objectType = 'tap'
        if ((objectTypeMask & bitLongNote) > 0) objectType = 'long-note'

        const column = (+values[0] - 64) / 128
        const time = +values[2] / 1000
        const length = 0 // TODO

        chart.notes.push({
          column,
          time,
          length,
        })
      }
    })

    return chart
  }
}
