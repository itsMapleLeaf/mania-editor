import { remote } from "electron"
import React, { useState } from "react"

export default function App() {
  const [content, setContent] = useState<string>()

  const showOpenDialog = () => {
    loadOsuFile()
      .then((content) => content && setContent(content))
      .catch((error) => alert(error?.message || String(error)))
  }

  return (
    <main>
      {content ?? <button onClick={showOpenDialog}>load .osu file</button>}
    </main>
  )
}

async function loadOsuFile(): Promise<string | undefined> {
  const result = await remote.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "osu! Chart", extensions: ["osu"] }],
  })
  if (result.canceled) return

  const [filePath] = result.filePaths
  return remote.require("fs").promises.readFile(filePath, "utf8")
}
