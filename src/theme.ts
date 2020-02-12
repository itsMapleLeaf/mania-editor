import {} from "@emotion/react"
import { darken, lighten, shade } from "polished"

type ColorPalette = { 0: string; 1: string; 2: string; 3: string }

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
    background: [charcoal, charcoal, charcoal, charcoal],
    primary: primaryColors,
    primaryText: clouds,
    text: clouds,
  },
  shadow: {
    normal: "0px 2px 6px rgba(0, 0, 0, 0.1)",
  },
}

export const lightTheme: AppTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: [clouds, clouds, clouds, clouds],
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
