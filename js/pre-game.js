const { contextBridge, ipcRenderer } = require("electron")

ipcRenderer.on("setSetting", (e, n, v) => {
    console.log(e, n, v)
    processSettedValue(n, v)
})
let settingNames = ["crosshair"]

const processSettedValue = (n, v) => {
    switch (n) {
        case ("crosshair"):
            return ""
        case ("css"):
            return ""
        case ("unlimitedFps"):
            return ""
    }
}

document.addEventListener("DOMContentLoaded", loadSettings(settingNames))