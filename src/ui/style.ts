import { css, Interpolation } from "@emotion/react"
import { AppTheme, BackgroundColorKey, PrimaryColorKey } from "./theme"

type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch"

type FlexJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"

type LengthUnit = number | "full" | StringAutocompleteHack

type StringAutocompleteHack = string & { __autocompleteHack?: never }

const len = (units: LengthUnit) =>
  typeof units === "number"
    ? `${units * 0.25}rem`
    : units === "full"
    ? "100%"
    : units

// layout
export const w = (units: LengthUnit) => css({ width: len(units) })
export const h = (units: LengthUnit) => css({ height: len(units) })
export const wh = (units: LengthUnit) => [w(units), h(units)]

export const p = (units: number) => css({ padding: `${units * 0.25}rem` })
export const pt = (units: number) => css({ paddingTop: `${units * 0.25}rem` })
export const pb = (units: number) =>
  css({ paddingBottom: `${units * 0.25}rem` })
export const pl = (units: number) => css({ paddingLeft: `${units * 0.25}rem` })
export const pr = (units: number) => css({ paddingRight: `${units * 0.25}rem` })
export const px = (units: number) => [pl(units), pr(units)]
export const py = (units: number) => [pt(units), pb(units)]

export const m = (units: number) => css({ margin: `${units * 0.25}rem` })
export const mt = (units: number) => css({ marginTop: `${units * 0.25}rem` })
export const mb = (units: number) => css({ marginBottom: `${units * 0.25}rem` })
export const ml = (units: number) => css({ marginLeft: `${units * 0.25}rem` })
export const mr = (units: number) => css({ marginRight: `${units * 0.25}rem` })
export const mx = (units: number) => [ml(units), mr(units)]
export const my = (units: number) => [mt(units), mb(units)]

export const flexRow = css({ display: "flex" })
export const flexColumn = css({ display: "flex", flexDirection: "column" })
export const flex1 = css({ flex: 1 })
export const alignItems = (alignItems: FlexAlign) => css({ alignItems })
export const alignContent = (alignContent: FlexAlign) => css({ alignContent })
export const justifyContent = (justifyContent: FlexJustify) =>
  css({ justifyContent })
export const flexCenter = [alignItems("center"), justifyContent("center")]

export const fixedCover = css({
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})

// colors
export const themeBgColor = (key: BackgroundColorKey) => (theme: AppTheme) =>
  css({ backgroundColor: theme.colors.background[key] })

export const themeTextColor = (theme: AppTheme) =>
  css({ color: theme.colors.text })

export const themePrimaryBgColor = (key: PrimaryColorKey) => (
  theme: AppTheme,
) => css({ backgroundColor: theme.colors.primary[key] })

export const themePrimaryTextColor = (theme: AppTheme) =>
  css({ color: theme.colors.primaryText })

// effects
export const transition = (properties: string) =>
  css({ transitionDuration: "0.2s", transitionProperty: properties })

export const rounded = css({ borderRadius: len(1) })

export const themeShadow = (theme: AppTheme) =>
  css({ boxShadow: theme.shadow.normal })

// states
export const hover = (style: Interpolation<AppTheme>) => {
  if (typeof style === "function") {
    return (theme: AppTheme) => css({ ":hover": style(theme) as any })
  }
  return css({ ":hover": style as any })
}