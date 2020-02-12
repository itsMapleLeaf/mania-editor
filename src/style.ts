import { css, Interpolation } from "@emotion/react"
import { AppTheme } from "./theme"

export const fixedCover = css({
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
})

export const p = (amount: number) => css({ padding: `${amount * 0.25}rem` })

export const themeBgColor = (theme: AppTheme) =>
  css({ background: theme.colors.background })

export const themeTextColor = (theme: AppTheme) =>
  css({ color: theme.colors.text })

export const hover = (style: Interpolation<AppTheme>) => {
  if (typeof style === "function") {
    return (theme: AppTheme) => css({ ":hover": style(theme) as any })
  }
  return css({ ":hover": style as any })
}
