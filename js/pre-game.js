const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const path = require("path")
const webFrame = require("electron").webFrame;

contextBridge.exposeInMainWorld("vvc", {
    copyName: (dom, value) => {
        console.log(dom)
        console.log(value)
        navigator.clipboard.writeText(value);
        dom.value = "Copied!"
        setTimeout(() => {
            dom.value = 'Copy';
        }, 2000);
    }

})

document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("pageLoaded");
    ipcRenderer.on("reload", () => { location.reload() })
    ipcRenderer.on("crosshairGen", (e, crosshairUrl, enableCrosshair) => {
        if (!document.getElementById("crosshair")) {
            let dom = `<img src="${crosshairUrl}" id="crosshair" style="display:${enableCrosshair ? "block" : "none"}"><style>#crosshair {position: fixed;left: 50%;top: 50%;transform: translate(-50%, -50%);}</style>`;
            document.getElementById("app").insertAdjacentHTML("afterbegin", dom);
        } else if (document.getElementById("crosshair")) {
            document.getElementsByName('crosshair').src = crosshairUrl
        }
    });
    ipcRenderer.on("cssGen", (e, css) => {
        console.log(css)
        document.body.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" href="${path.join(__dirname, "../html/game.css")}">`)
        if (!document.getElementById('customCSS')) {
            let dom = `<style id="customCSS">${css}</style>`
            document.body.insertAdjacentHTML("afterbegin", dom);
        } else if (document.getElementById('customCSS')) {
            document.getElementById('customCSS').innerText = css
        }
    })
    ipcRenderer.on("setSetting", (e, n, v) => {
        switch (n) {
            case ("crosshair"):
                document.getElementById('crosshair').src = v
                break
            case ("enableCrosshair"):
                document.getElementById('crosshair').style.display = `${v ? "block" : "none"}`
                break
            case ("customCSS"):
                document.getElementById('customCSS').innerText = v
                break
                // case ("fpsDisplay"):
                document.getElementById("fps").style.display = v ? "block" : "none";
                break
                // case ("fpsPosition"):
                switch (v) {
                    case ("topRight"):
                        document.getElementById("fps").style.top = "0";
                        document.getElementById("fps").style.left = "unset";
                        document.getElementById("fps").style.right = "0";
                        document.getElementById("fps").style.bottom = "unset";
                        break
                    case ("topLeft"):
                        document.getElementById("fps").style.top = ""; 0
                        document.getElementById("fps").style.left = "0";
                        document.getElementById("fps").style.right = "unset";
                        document.getElementById("fps").style.bottom = "unset";
                        break
                    case ("bottomLeft"):
                        document.getElementById("fps").style.top = "unset";
                        document.getElementById("fps").style.left = "0";
                        document.getElementById("fps").style.right = "unset";
                        document.getElementById("fps").style.bottom = "0";
                        break
                    case ("bottomRight"):
                        document.getElementById("fps").style.top = "unset";
                        document.getElementById("fps").style.left = "unset";
                        document.getElementById("fps").style.right = "0";
                        document.getElementById("fps").style.bottom = "16px";
                        break
                }
        }
    })
    ipcRenderer.on("appName", (e, v, n) => {
        const dom = `<div id="appVer" style="position:fixed;right:4px;bottom:2px;color:white;font-weight:bolder;font-size:12px">Vanced Voxiom Client v${v}</div>`
        document.querySelector("#app").insertAdjacentHTML('beforeend', dom)
    })
})