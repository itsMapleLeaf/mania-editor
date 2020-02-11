import { remote } from "electron"
import React, { useState } from "react"

function App() {
  const [content, setContent] = useState<string>()

  const showOpenDialog = () => {
    remote.dialog
      .showOpenDialog({ properties: ["openFile"] })
      .then((result) => {
        const [filePath] = result.filePaths
        return remote.require("fs").promises.readFile(filePath, "utf8")
      })
      .then(setContent)
      .catch((error) => alert(error?.message || String(error)))
  }

  return (
    <main>
      {content ?? <button onClick={showOpenDialog}>load .osu file</button>}
    </main>
  )
}

export default App
