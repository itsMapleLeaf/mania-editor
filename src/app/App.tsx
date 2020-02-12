import React, { useState } from "react"
import { loadOsuFile } from "../osu/loadOsuFile"
import { button } from "../ui/components"
import {
  flexCenter,
  flexColumn,
  h,
  maxH,
  maxW,
  size,
  themeBgColor,
  themeShadow,
  w,
} from "../ui/style"

export default function App() {
  const [content, setContent] = useState<string>()

  const showOpenDialog = () => {
    loadOsuFile()
      .then((content) => content && setContent(content))
      .catch((error) => alert(error?.message || String(error)))
  }

  return (
    <main css={[flexColumn, flexCenter, w("100vw"), h("100vh")]}>
      <div
        css={[
          flexColumn,
          flexCenter,
          themeBgColor(0),
          size("full"),
          maxW(70),
          maxH(100),
          themeShadow,
        ]}
      >
        <button type="button" css={button} onClick={showOpenDialog}>
          load .osu file{" "}
          <span role="img" aria-label="turk">
            🦃
          </span>
        </button>
      </div>
      {content}
    </main>
  )
}
