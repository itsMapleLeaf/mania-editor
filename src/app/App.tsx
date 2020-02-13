import { css } from "@emotion/react"
import React, { useState } from "react"
import { loadOsuFile } from "../osu/loadOsuFile"
import background from "../ui/bg.png"
import { button } from "../ui/components"
import {
  absoluteFill,
  flexCenter,
  flexColumn,
  h,
  opacity,
  relative,
  w,
} from "../ui/style"

export default function App() {
  const [content, setContent] = useState<string>()

  const showOpenDialog = () => {
    loadOsuFile()
      .then((content) => content && setContent(content))
      .catch((error) => alert(error?.message || String(error)))
  }

  const backgroundStyle = css({
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  })

  return (
    <main css={[w("100vw"), h("100vh"), relative]}>
      <div css={[absoluteFill, backgroundStyle, opacity(0.3)]}></div>
      <div css={[absoluteFill, flexColumn, flexCenter]}>
        <button css={button}>test</button>
      </div>
    </main>
  )
}
