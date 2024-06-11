const { contextBridge, ipcRenderer } = require("electron");
const webFrame = require("electron").webFrame;


document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("pageLoaded");
    ipcRenderer.on("fpsDisplay", () => {
        fpsDisplay()
    })
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
    ipcRenderer.on("appName", (e, v) => {
        const dom = `<div id="appVer" style="position:fixed;right:4px;bottom:2px;color:white;font-weight:bolder;font-size:12px">Vanced Voxiom Client v${v}</div>`
        document.querySelector("#app").insertAdjacentHTML('beforeend', dom)
    })
});

const fpsDisplay = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('webgl');
    let fpsDom = document.createElement("div")
    fpsDom.setAttribute("id", "fps")
    fpsDom.setAttribute('style', `bottom:16px;right:0;position:fixed;font-size:15px;color:lime`)
    document.querySelector("#app").appendChild(fpsDom)
    const fpsElem = document.querySelector("#fps");
    let frameCount = 0;
    let lastTime = performance.now();
    function update(time) {
        frameCount++;
        const elapsedTime = time - lastTime;
        if (elapsedTime >= 1000) {
            const fps = frameCount / (elapsedTime / 1000);
            fpsElem.innerText = Math.round(fps);
            frameCount = 0;
            lastTime = time;
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
