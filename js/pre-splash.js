const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.send("appVer")
    ipcRenderer.on("appVerRe", (e, v) => {
        document.getElementById("appVer").innerText = `Vanced Voxiom Client v${v}`;
    })
    ipcRenderer.on('status', (e, v) => {
        document.getElementById('updateStat').innerText=v
    })
})