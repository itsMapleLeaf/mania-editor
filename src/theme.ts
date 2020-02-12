import {} from "@emotion/react"

export type AppTheme = {
  colors: {
    background: string
    text: string
  }
}

export const darkTheme: AppTheme = {
  colors: {
    background: "black",
    text: "white",
  },
}

export const lightTheme: AppTheme = {
  colors: {
    background: "white",
    text: "black",
  },
}

declare module "@emotion/react" {
  export interface Theme extends AppTheme {}
}
