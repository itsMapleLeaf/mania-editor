import { Global, ThemeProvider } from "@emotion/react"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { reset } from "./reset"
import { darkTheme } from "./theme"

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <App />
    <Global styles={reset} />
  </ThemeProvider>,
  document.getElementById("root"),
)
