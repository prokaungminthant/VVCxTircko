const { contextBridge, ipcRenderer } = require("electron")
const webFrame = require("electron").webFrame
contextBridge.exposeInMainWorld("vvc", {
    getSetting: (n) => { console.log(ipcRenderer.invoke("getSetting", n)) }
})

let cssNum = 0;
ipcRenderer.on("setSetting", async (e, n, v) => {
    switch (n) {
        case ("customCSS"):
            cssDelete()
            cssNum++
            webFrame.insertCSS(v)
            break
    }
})

ipcRenderer.on("reload", v => {
    location.reload()
})

const cssLoad = async () => {
    let v = await ipcRenderer.invoke("getSetting", "customCSS")
    webFrame.insertCSS(v, "Namekuji")
    cssNum++
}
const cssDelete = () => {
    webFrame.removeInsertedCSS(String(cssNum))
}

document.addEventListener("DOMContentLoaded", cssLoad())