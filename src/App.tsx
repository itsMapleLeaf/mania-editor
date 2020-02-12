import React, { useState } from "react"
import { button } from "./components"
import { loadOsuFile } from "./loadOsuFile"
import { flexCenter, flexColumn, h, w } from "./style"

export default function App() {
  const [content, setContent] = useState<string>()

  const showOpenDialog = () => {
    loadOsuFile()
      .then((content) => content && setContent(content))
      .catch((error) => alert(error?.message || String(error)))
  }

  return (
    <main css={[flexColumn, flexCenter, w("100vw"), h("100vh")]}>
      <button type="button" css={button} onClick={showOpenDialog}>
        load .osu file{" "}
        <span role="img" aria-label="turk">
          🦃
        </span>
      </button>
      {content}
    </main>
  )
}
