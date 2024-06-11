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
});

const fpsDisplay = () => {
    let fpsDom = document.createElement("div")
    fpsDom.setAttribute("id", "fps")
    fpsDom.setAttribute('style', `top:0;left:0;position:fixed;font-size:12px`)
    document.querySelector("#app").appendChild(fpsDom)
    const fpsElem = document.querySelector("#fps");
    let then = 0;
    function render(now) {
        now *= 0.001;                          // convert to seconds
        const deltaTime = now - then;          // compute time since last frame
        then = now;                            // remember time for next frame
        const fps = 1 / deltaTime;             // compute frames per second
        fpsElem.textContent = fps.toFixed(1);  // update fps display
        requestAnimationFrame(render);
    }
}
