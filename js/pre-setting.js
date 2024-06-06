const { contextBridge, ipcRenderer } = require("electron");
//n: name
//v: value

const settingNames = ["crosshair", "unlimitedFps", "swapper", "angleType"]
//ウェブページにwindow.vvcから始まる関数を登録している
contextBridge.exposeInMainWorld("vvc", {
    //入力された値をmain.jsに送信している
    setting: (n, v) => ipcRenderer.send("setting", n, v)
    // window.vvc.setting(settingName, settingValue)
})

ipcRenderer.on("loadedSetting", (e, n, v) => {
    // console.log(n, v)
    loads(n, v)
})

const loads = (n, v) => {
    let inputType
    if (document.getElementById(n)) {
        inputType = document.getElementById(n).getAttribute("type")
    }
    switch (inputType) {
        case ("checkbox"):
            return document.getElementById(n).checked = v
        case ("url"):
            return document.getElementById(n).value = v
        case ("select"):
            return document.getElementById(n).value = v
        case (undefined):
            return (console.log("undefined"))
    }
}

const requestSetingLoad = () => {
    for (setName of settingNames) {
        ipcRenderer.send("loadSettings", setName)
    }
}

window.onload = requestSetingLoad
