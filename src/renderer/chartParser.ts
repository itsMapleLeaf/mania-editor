import * as fs from 'fs'

export type SectionData = {
  type: 'section'
  name: string
}

export type KeyValueData = {
  type: 'key-value'
  section: string
  key: string
  value: string
}

export type TimingPointData = {
  type: 'timing-point'
  offset: number
  millisPerBeat: number
  meter: number
  sampleType: number
  sampleSet: number
  volume: number
  isInherited: number
  isKiai: number
}

export type HitObjectData = {
  type: 'hit-object'
  x: number
  y: number
  time: number
  objectType: HitObjectType
}

export type HitObjectType = 'tap' | 'long-note' | 'unknown'

export type UnknownData = {
  type: 'unknown'
  value: string
}

export type ChartLineData =
  | SectionData
  | KeyValueData
  | TimingPointData
  | HitObjectData
  | UnknownData

export type ChartData = ChartLineData[]

export function loadChartFile(chartPath: string) {
  return new Promise<ChartData>((resolve, reject) => {
    fs.readFile(chartPath, (err, buffer) => {
      if (err) return reject(err)

      const content = buffer.toString()

      let currentSection = ''

      //#region parsers

      function parseSection(line: string): SectionData | void {
        const sectionPattern = /\[([a-z]+)\]/i
        const sectionMatch = line.match(sectionPattern)
        if (sectionMatch) {
          currentSection = sectionMatch[1]
          return {
            type: 'section',
            name: sectionMatch[1],
          }
        }
      }

      function parseKeyValue(line: string): KeyValueData | void {
        const keyValuePattern = /([a-z]+):\s*(.*)/i
        const keyValueMatch = line.match(keyValuePattern)
        if (keyValueMatch) {
          return {
            type: 'key-value',
            section: currentSection,
            key: keyValueMatch[1],
            value: keyValueMatch[2],
          }
        }
      }

      function parseTimingPoint(line: string): TimingPointData | void {
        if (currentSection === 'TimingPoints') {
          const values = line.split(/\s*,\s*/).map(Number)

          return {
            type: 'timing-point',
            offset: values[0],
            millisPerBeat: values[1],
            meter: values[2],
            sampleType: values[3],
            sampleSet: values[4],
            volume: values[5],
            isInherited: values[6],
            isKiai: values[7],
          }
        }
      }

      function parseHitObject(line: string): HitObjectData | void {
        if (currentSection === 'HitObjects') {
          const values = line.split(/\s*,\s*/)

          const bitTap = 0b00000001
          const bitLongNote = 0b10000000

          const objectTypeMask = +values[3]

          let objectType: HitObjectType = 'unknown'
          if ((objectTypeMask & bitTap) > 0) objectType = 'tap'
          if ((objectTypeMask & bitLongNote) > 0) objectType = 'long-note'

          return {
            type: 'hit-object',
            x: +values[0],
            y: +values[1],
            time: +values[2],
            objectType,
          }
        }
      }

      function parseUnknown(line: string): UnknownData {
        return {
          type: 'unknown',
          value: line,
        }
      }

      //#endregion

      const parsedContent = content
        .split(/[\r\n]+/)
        .filter(line => line.length > 0)
        .map(line => {
          return (
            parseSection(line) ||
            parseKeyValue(line) ||
            parseTimingPoint(line) ||
            parseHitObject(line) ||
            parseUnknown(line)
          )
        })

      resolve(parsedContent)
    })
  })
}
