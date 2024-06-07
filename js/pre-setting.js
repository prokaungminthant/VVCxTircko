const { contextBridge, ipcRenderer } = require("electron");
const webFrame = require('electron').webFrame;
//n: name
//v: value

const settingNames = ["crosshair", "unlimitedFps", "swapper", "angleType"]
//ウェブページにwindow.vvcから始まる関数を登録している
contextBridge.exposeInMainWorld("vvc", {
    //入力された値をmain.jsに送信している
    setting: (n, v) => ipcRenderer.send("setting", n, v),
    joinGame: (v) => ipcRenderer.send("joinGame", v),
    invite: async () => await ipcRenderer.invoke("invLink"),
    // window.vvc.setting(settingName, settingValue)
    on: (channel, func) => { //rendererでの受信用, funcはコールバック関数//
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
})

ipcRenderer.on("loadedSetting", (e, n, v) => {
    // console.log(n, v)
    loads(n, v)
})
// ipcRenderer.on("invLink", (e, v) => {
// })

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
