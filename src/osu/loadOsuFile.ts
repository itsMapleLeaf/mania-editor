import { remote } from "electron"

export async function loadOsuFile(): Promise<string | undefined> {
  const result = await remote.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "osu! Chart", extensions: ["osu"] }],
  })

  if (result.canceled) return

  const [filePath] = result.filePaths
  return remote.require("fs").promises.readFile(filePath, "utf8")
}
