const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.invoke("appVer").then((version) => {
        document.getElementById("appVer").innerText = `Vanced Voxiom Client v${version}`;
    });
    ipcRenderer.on('status', (e, v) => {
        document.getElementById("updateStat").innerText = v;
    })
})