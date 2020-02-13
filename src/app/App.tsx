import { css } from "@emotion/react"
import React, { ComponentPropsWithoutRef } from "react"
import background from "../ui/bg.png"
import {
  absolute,
  absoluteFill,
  h,
  left,
  len,
  opacity,
  relative,
  semiBlackBg,
  w,
} from "../ui/style"

export default function App() {
  // const [content, setContent] = useState<string>()

  // const showOpenDialog = () => {
  //   loadOsuFile()
  //     .then((content) => content && setContent(content))
  //     .catch((error) => alert(error?.message || String(error)))
  // }

  const backgroundStyle = css({
    backgroundImage: `url(${background})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  })

  return (
    <main css={[w("100vw"), h("100vh"), relative]}>
      <div css={[absoluteFill, backgroundStyle, opacity(0.3)]}></div>
      <Editor css={[absoluteFill]} />
    </main>
  )
}

type Note = {
  key: number
  column: number
  time: number
}

const notes: Note[] = [
  { key: 1, column: 0, time: 0 },
  { key: 2, column: 1, time: 1 },
  { key: 3, column: 2, time: 2 },
  { key: 4, column: 3, time: 3 },
]

const noteWidth = 15
const trackPixelsPerSecond = 30

const noteStyle = [w(noteWidth), h(7), { backgroundColor: "white" }]

function Editor(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div {...props}>
      <div
        css={[
          semiBlackBg(0.5),
          w(noteWidth * 4),
          h("full"),
          absolute,
          left(20),
        ]}
      >
        {notes.map((note) => (
          <div
            key={note.key}
            css={[noteStyle, absolute]}
            style={{
              left: len(noteWidth * note.column),
              bottom: len(trackPixelsPerSecond * note.time),
            }}
          />
        ))}
      </div>
    </div>
  )
}
