import {} from "@emotion/react"
import { darken, lighten, shade } from "polished"

type ColorPalette = Record<0 | 1 | 2 | 3, string>

export type AppTheme = {
  colors: {
    background: ColorPalette
    text: string
    primary: ColorPalette
    primaryText: string
  }
  shadow: {
    normal: string
  }
}

export type BackgroundColorKey = keyof AppTheme["colors"]["background"]
export type PrimaryColorKey = keyof AppTheme["colors"]["primary"]

const charcoal = "#2E4057"
const river = "#3498db"
const clouds = "#ecf0f1"

const primaryColors: ColorPalette = [
  lighten(0.1, river),
  river,
  shade(0.25, river),
  shade(0.42, river),
]

export const darkTheme: AppTheme = {
  colors: {
    background: [
      charcoal,
      shade(0.2, charcoal),
      shade(0.4, charcoal),
      shade(0.6, charcoal),
    ],
    primary: primaryColors,
    primaryText: clouds,
    text: clouds,
  },
  shadow: {
    normal: "0px 2px 6px rgba(0, 0, 0, 0.25)",
  },
}

export const lightTheme: AppTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: [
      clouds,
      shade(0.1, clouds),
      shade(0.2, clouds),
      shade(0.3, clouds),
    ],
    text: darken(0.2, charcoal),
  },
  shadow: {
    ...darkTheme.shadow,
    normal: "0px 2px 6px rgba(0, 0, 0, 0.5)",
  },
}

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
