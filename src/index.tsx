import { ThemeProvider } from "@emotion/react"
import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { darkTheme } from "./theme"

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root"),
)
