const { contextBridge, ipcRenderer } = require("electron");
const webFrame = require("electron").webFrame;


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
        if (!document.getElementById('customCSS')) {
            let dom = `<style id="customCSS">${css}</style>`
            document.body.insertAdjacentHTML("beforeend", dom);
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
        }
    })
});
