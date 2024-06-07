const { contextBridge, ipcRenderer } = require("electron")
const webFrame = require("electron").webFrame

contextBridge.exposeInMainWorld("vvc", {
    getSetting: (n) => { console.log(ipcRenderer.invoke("getSetting", n)) }
})

ipcRenderer.on("setSetting", (e, n, v) => {
    console.log(e, n, v)
    processSettedValue(n, v)
})

ipcRenderer.on("reload", v => {
    location.reload()
})

const cssLoad = async () => {
    let v = await ipcRenderer.invoke("getSetting", "css")
    webFrame.insertCSS(v)
}

document.addEventListener("DOMContentLoaded", cssLoad())