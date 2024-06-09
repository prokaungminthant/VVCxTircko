const { contextBridge, ipcRenderer } = require("electron");
const webFrame = require('electron').webFrame;
//n: name
//v: value

const settingNames = ["crosshair", "enableCrosshair", "unlimitedFps", "defPage", "swapper", "angleType", "customCSS"]

//ウェブページにwindow.vvcから始まる関数を登録している
contextBridge.exposeInMainWorld("vvc", {
    //入力された値をmain.jsに送信している
    // window.vvc.setting(settingName, settingValue)
    setting: (n, v) => ipcRenderer.send("setting", n, v),
    joinGame: (v) => ipcRenderer.send("joinGame", v),
    invite: async () => await ipcRenderer.invoke("invLink"),
    reload: () => ipcRenderer.send("reload"),
    open: (v) => ipcRenderer.send("openLink", v)
})

ipcRenderer.on("loadedSetting", (e, n, v) => {
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
        case ("textarea"):
            return document.getElementById(n).value = v
        case (undefined):
            return (console.log("undefined"))
    }
}

const requestSettingLoad = () => {
    for (setName of settingNames) {
        ipcRenderer.send("loadSettings", setName)
    }
}

window.onload = requestSettingLoad
