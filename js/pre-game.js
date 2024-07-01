const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const path = require("path")
const webFrame = require("electron").webFrame;

contextBridge.exposeInMainWorld("vvc", {
    returnPersist: (v) => ipcRenderer.send("returnPersist", v),
    copyName: (dom, value) => {
        navigator.clipboard.writeText(value);
        dom.value = "Copied!"
        setTimeout(() => {
            dom.value = 'Copy';
        }, 2000);
    },
})
let debugInterval

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
        document.body.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" href="${path.join(__dirname, "../html/game.css")}">`)
        if (!document.getElementById('customCSS')) {
            let dom = `<style id="customCSS">${css}</style>`
            document.body.insertAdjacentHTML("afterbegin", dom);
        } else if (document.getElementById('customCSS')) {
            document.getElementById('customCSS').innerText = css
        }

    })
    ipcRenderer.on("appName", (e, v, n) => {
        const dom = `<div id="appVer" style="position:fixed;right:4px;bottom:2px;color:white;font-weight:bolder;font-size:12px">Vanced Voxiom Client v${v}</div>`
        document.querySelector("#app").insertAdjacentHTML('beforeend', dom)
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
            case ("betterDebugDisplay"): {
                debugFunc(v)
            }
        }
    })
    ipcRenderer.on("betterDebugDisplay", (e, v) => {
        debugFunc(v)
    })
    ipcRenderer.on("loadJs", (e, v) => {
        eval(v)
    })
    ipcRenderer.on("importGameSetting", (e, v) => {
        console.log(v)
        let setting = JSON.parse(v)
        console.log(setting)
        setting = JSON.stringify(setting)
        console.log(setting)
        localStorage.setItem("persist:root", setting)
    })
})
window.addEventListener('resize', () => {
    windowResize()
});

let debugFunc = (v) => {
    //まずマップのエレメントを取得して、場所を割り出す
    let posY = document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().y
    let posX = Math.floor(document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().x + document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().width + 5)
    let debugDisplay = document.getElementById("debugDisplay")
    if (!debugDisplay) {
        let displayDom = `<div id="debugDisplay" style="left:${posX}px;top:${posY}px;" class="hide"></div>`
        document.getElementById("app").insertAdjacentHTML("afterbegin", displayDom)
        debugDisplay = document.getElementById("debugDisplay")
    } else if (debugDisplay) {
        debugDisplay.style.left = posX + "px"
        debugDisplay.style.top = posY + "px"
    }
    let debugDom = document.querySelector('div[style="width: 550px; position: absolute; top: 0px; left: 0px; padding: 10px; pointer-events: none; background-color: rgba(0, 0, 0, 0.8); display: block;"]') ? document.querySelector('div[style="width: 550px; position: absolute; top: 0px; left: 0px; padding: 10px; pointer-events: none; background-color: rgba(0, 0, 0, 0.8); display: block;"]') : document.querySelector('div[style="width: 550px; position: absolute; top: 0px; left: 0px; padding: 10px; pointer-events: none; background-color: rgba(0, 0, 0, 0.8); display: none;"]')
    if (debugDom) {
        debugDom.setAttribute("id", "defaultDebug")
        debugDom = document.getElementById("defaultDebug")
        if (v) {
            debugDom.classList.contains("hide") ? "" : debugDom.classList.add("hide");
            if (debugDom.style.display === "block") {
                debugDisplay.classList.contains("hide") ? debugDisplay.classList.remove("hide") : "";
                debugInterval = setInterval(function () {
                    let debugText = debugDom.innerHTML
                    let nospace = debugText.replace(/\s+/g, '');
                    let resultArray = nospace.split('<br>')
                    let va1 = resultArray[0].split(':');
                    let va2 = resultArray[2].match(/x:-?\d+|y:-?\d+|z:-?\d+/g);
                    let va3 = resultArray[11].split(':');
                    let domInnnerHtml = `
                    <div> ${Math.floor(va1[1])}FPS</div>
                    <div> ${va2[0]}</div>
                    <div> ${va2[1]}</div>
                    <div> ${va2[2]}</div>
                    <div> ${va3[1]}</div>`
                    document.getElementById("debugDisplay").innerHTML = domInnnerHtml
                }, 200);
            } else if (debugDom.style.display === "none") {
                clearInterval(debugInterval);
                debugInterval = null;
                debugDisplay.classList.contains("hide") ? "" : debugDisplay.classList.add("hide");
            }
        } else if (!v) {
            debugDom.classList.contains("hide") ? debugDom.classList.remove("hide") : ""
            debugDisplay.classList.contains("hide") ? "" : debugDisplay.classList.add("hide");
            clearInterval(debugInterval);
            debugInterval = null;
        }
    }
}

const windowResize = (v) => {
    let posY = document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().y
    let posX = Math.floor(document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().x + document.querySelector(".sc-jcEtbA.hjohWN").getBoundingClientRect().width + 5)
    let debugDisplay = document.getElementById("debugDisplay")
    if (debugDisplay) {
        debugDisplay.style.left = posX + "px"
        debugDisplay.style.top = posY + "px"
    }
}
ipcRenderer.on("givePersist", e => {
    sendPersist()
})

let sendPersist = () => {
    let v = localStorage.getItem("persist:root")
    console.log(v)
    ipcRenderer.send('returnPersist', v)
}