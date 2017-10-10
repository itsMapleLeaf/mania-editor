import * as fs from 'fs'
import { promisify } from 'util'

type HitObject = {
  x: number
  y: number
  time: number
  objectType: HitObjectType
}

type HitObjectType = 'tap' | 'long-note' | 'unknown'

type TimingPoint = {
  offset: number
  millisPerBeat: number
  meter: number
  sampleType: number
  sampleSet: number
  volume: number
  isInherited: number
  isKiai: number
}

const readFile = promisify(fs.readFile)

const sectionPattern = /\[([a-z]+)\]/i

/** A representation of an .osu file */
export class Chart {
  hitObjects = [] as HitObject[]
  timingPoints = [] as TimingPoint[]

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
          offset: values[0],
          millisPerBeat: values[1],
          meter: values[2],
          sampleType: values[3],
          sampleSet: values[4],
          volume: values[5],
          isInherited: values[6],
          isKiai: values[7],
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

        chart.hitObjects.push({
          x: +values[0],
          y: +values[1],
          time: +values[2],
          objectType,
        })
      }
    })

    return chart
  }
}
