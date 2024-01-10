const { ipcRenderer, shell, app, dialog } = require('electron');
const store = require("electron-store");
const log = require("electron-log");
const path = require("path")
const fs = require('fs');

const config = new store()
const setting = require("./setting")

log.info("gametools.js has been loaded.")

exports.clientTools = class {
    generateSettingDom(val) {
        // log.info(val.id, config.get(val.id))
        switch (val.type) {
            case "checkbox":
                return `<input id="settingCheckbox" type="checkbox" onclick="window.tool.setSetting('${val.id}',this.checked)"${config.get(val.id, val.default) ? 'checked' : ''}>`;
            case "text":
                return `<input id="settingTextbox" type="text" onInput="window.tool.setSetting('${val.id}',this.value)" value="${config.get(val.id) != null ? config.get(val.id) : val.default}" > `;
            case "select":
                let dom = `<select onchange="window.tool.setSetting('${val.id}',this.value);">`
                Object.keys(val.options).forEach((opt) => {
                    dom += `<option value="${opt}" ${config.get(val.id, val.default) === opt ? ' selected' : ''}> ${val.options[opt]} </option>`
                });
                return dom += `</select>`;
            case "range-text":
                return `
                <div id="rangeNum">
                    <input type="range" id="range${val.id}"min="0" max="1024" value="${config.get(val.id) ? config.get(val.id) : val.default}" step="1" oninput="window.tool.sliderMove('${val.id}',this.value);window.tool.setSetting('${val.id}',this.value)">
                    <input type="number" id="num${val.id}" min="0" max="1024" value="${config.get(val.id) ? config.get(val.id) : val.default}" step="1"oninput="window.tool.numInput('${val.id}',this.value);window.tool.setSetting('${val.id}',this.value)">
                </div>`;
            case "textarea":
                return `
                <textarea id="${val.id}" onchange="window.tool.setSetting('${val.id}',this.value)">${config.get(val.id) != null ? config.get(val.id) : ""}</textarea>`;
            case "password":
                return `<input type="password" id="${val.id}" oninput="window.tool.setSetting('${val.id}',this.value)" value="${config.get(val.id) != null ? config.get(val.id) : ""}">`;
            case "button":
                return `<input type="button" id="${val.id}" value="${val.buttonVal}" onclick="window.tool.setSetting('${val.id}')">`;
            case "openFile":
                return `<input title="${config.get(val.id) != null ? config.get(val.id) : 'No file selected'}" type="button" id="${val.id}" value="OPEN FILE" onclick="window.tool.openFile('${val.id}')">`;
        }
    };
    setupClientSetting() {
        const windowInitialize = () => {
            let settingWindowHTML = `<div id="windowCloser" onclick="window.tool.closeSetting()" class="${config.get("settingWindowOpen") ? "" : "hide"}"></div><div id="vvcSetting" ${config.get("settingWindowOpen") ? 'class=""' : 'class="hide" '}><div id="settingTitleBar">Vanced Voxiom Client Settings<span class="material-symbols-outlined closeBtn" onclick="window.tool.closeSetting()">close</span></div><div id="setBody">`;
            let prevCat = null;
            Object.values(setting).forEach((val) => {
                let dom = "";
                if (val.cat != prevCat) {
                    if (prevCat) {
                        dom += `</div>`
                    }
                    dom += `<div id="setBox">
                                <div id="${val.cat}" class="catTitle">${val.cat}</div><div id="horizonalSpacer"></div>`;
                    prevCat = val.cat
                }
                dom += `<div id="setItem"><div id="settingName">${val.title}</div>`
                settingWindowHTML += dom + this.generateSettingDom(val) + "</div>"
            });
            settingWindowHTML += `<div id=setBox><div class=catTitle>Account manager</div><div id=horizonalSpacer></div><div id=setItem class=gridBtn><input onclick='window.open("https://google.com")' type=button value=Google><input onclick='window.open("https://www.facebook.com")' type=button value=Facebook><input onclick='window.open("https://discord.com/channels/@me")' type=button value=Discord><input onclick='window.tool.help()' type=button value="Open Help"></div></div>`
            return settingWindowHTML ? settingWindowHTML + "</div></div></div>" : ""
        }
        document.body.insertAdjacentHTML("afterbegin", windowInitialize())
    };
    vvcSettingStyleInject() {
        let dom = `<link rel="stylesheet" href="vvc://${path.join(__dirname, "../../html/css/vvc.css")}">`
        return dom
    };
    initDoms() {
        let dom1 = `<style id="customBgCss">.bNczYf{background-image:url("${config.get("customBG") == null || config.get("customBG") == "" ? setting.customBackGround.default : config.get("customBG")}")}.hrxbol{content:url("${config.get("customLogo") == "" || config.get("customLogo") == null ? setting.customGameLogo.default : config.get("customLogo")}")}</style>`;
        document.body.insertAdjacentHTML("afterbegin", dom1);
        let dom2 = `<style id="snowStyle"> .snowflakes {display: ${config.get("disableSnow") !== true ? "unset" : "none"}}</style>`
        document.body.insertAdjacentHTML("afterbegin", dom2);
        let dom3 = `<style id="freeGem">.ksWDWD{display:${config.get("disableGemPopup") !== true ? "unset" : "none !important"}}</style>`
        document.body.insertAdjacentHTML("afterbegin", dom3);
        let crosshair = `<img id="crosshair" style="width:${config.get("crosshairSizeX") != null ? config.get("crosshairSizeX") : setting.crosshairSizeX.default}px;height:${config.get("crosshairSizeY") != null ? config.get("crosshairSizeY") : setting.crosshairSizeY.default}px;" src="${config.get("customCrosshairImage") != null ? config.get("customCrosshairImage") : setting.customCrosshairImage.default}" class="${config.get("customCrosshairCheckbox") ? "" : "hide"}" ></img>`
        document.getElementById("app").insertAdjacentHTML("afterbegin", crosshair);
        let matchList = `<div id=matchCloser class=hide onclick=window.tool.closeMatchList()></div><div id=matchList class=hide><div id=settingTitleBar>Match Browser <span class="closeBtn material-symbols-outlined"onclick=window.tool.closeMatchList()>close</span></div><div id=setBody><div id=matches><table id=matchTable><tbody id=matchInfo></tbody></table></div></div></div>`
        document.body.insertAdjacentHTML("afterbegin", matchList)
        if (config.get("cssType") === "none") {
            console.log("No custom css gen")
        } else if (config.get("cssType") === "text") {
            let css = `<style id="customCSS">${config.get("cssTextarea") != null ? config.get("cssTextarea") : ""}</style>`;
            document.body.insertAdjacentHTML("afterbegin", css)
        } else if (config.get("cssType") === "localfile") {
            let css = `<link rel="stylesheet" id="customCSS" href="vvc://${config.get("cssLocal") != null ? config.get("cssLocal") : ""}">`;
            document.body.insertAdjacentHTML("afterbegin", css)
        } else if (config.get("cssType") === "online") {
            let css = `<style id="customCSS">@import url('${config.get("cssUrl") != null ? config.get("cssUrl") : ""}');</style>`;
            document.body.insertAdjacentHTML("afterbegin", css)
        }
    };
    initTitleText() {
        let titleText = document.getElementsByClassName("yYlig")[0]
        titleText.innerText = config.get("customGameLogoText") ? config.get("customGameLogoText") : setting.customGameLogoText.default
    };
    urlChanged(url) {
        switch (url) {
            case "https://voxiom.io/account":

                function accountInject() {
                    let dom = document.querySelector('.lfDZCd');
                    if (dom) {
                        dom.innerHTML = `<div id=login><a class=discord href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Discord</a> <a class=google href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Google</a> <a class=facebook href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Facebook</a></div><style>#loginBtn{text-align:center;padding:10px;text-decoration:none;color:#fff;margin-bottom:10px;width:200px;display:flex;-webkit-box-align:center;align-items:center;cursor:pointer}.discord{background-color:#7289da}.google{background-color:#ea4435}.facebook{background-color:#4967aa}.discord:hover{background-color:#8da6ff}.google:hover{background-color:#ff6a5c}.facebook:hover{background-color:#658be2}</style>`
                    }
                }
                accountInject();
                break;
        }
    }
    sendWebhook(node) {
        // console.log(node);
        if (config.get("enableCtW")) {
            let text = node.innerText.replace(/[`]/g, "'")
            try {
                let url = config.get("webhookUrl")
                const req = {
                    content: "`" + text + "`",
                    username: "Vanced Voxiom Client CtW Tool",
                    avatar_url: "https://i.imgur.com/bdClDSq.png",
                    allowed_mentions: {
                        parse: []
                    }
                }
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req),
                })
            } catch (error) { }
        }
    }

}
exports.settingTool = class {
    closeSetting() {
        let settingWindow = document.getElementById("vvcSetting");
        let closer = document.getElementById("windowCloser");
        settingWindow != null ? settingWindow.classList.toggle("hide") : "";
        closer != null ? closer.classList.toggle("hide") : "";
        config.set("settingWindowOpen", !document.getElementById("vvcSetting").classList.contains("hide"))
    };
    setSetting(id, value) {

        value != null ? config.set(id, value) : "";
        log.info(id, value)
        switch (id) {
            case "customBG":
                document.getElementById("customBgCss").innerText = `.bNczYf{background-image:url("${value == "" ? setting.customBackGround.default : value = null ? setting.customBackGround.default : value}")}.hrxbol{content:url("${config.get("customLogo") == "" || config.get("customLogo") == null ? setting.customGameLogo.default : config.get("customLogo")} ")}`
                break;
            case "customLogo":
                document.getElementById("customBgCss").innerText = `.bNczYf{background-image:url("${config.get("customBG") == null || config.get("customBG") == "" ? setting.customBackGround.default : config.get("customBG")}")}.hrxbol{content:url("${value == "" || value == null ? setting.customGameLogo.default : value}")}`;;
                break;
            case "customGameLogoText":
                document.querySelector(".yYlig").innerText = value
                break;
            case "customCrosshairCheckbox":
                value ? document.getElementById('crosshair').classList.remove("hide") : document.getElementById('crosshair').classList.add("hide");
                break;
            case "customCrosshairImage":
                document.getElementById("crosshair").setAttribute("src", value)
                break;
            case "crosshairSizeX":
                document.getElementById("crosshair").setAttribute("style", `width:${value != null ? value : setting.crosshairSizeX.default}px;height:${config.get("crosshairSizeY") != null ? config.get("crosshairSizeY") : setting.crosshairSizeY.default}px;`)
                break;
            case "crosshairSizeY":
                document.getElementById("crosshair").setAttribute("style", `width:${config.get("crosshairSizeX") != null ? config.get("crosshairSizeX") : setting.crosshairSizeX.default}px;height:${value != null ? value : setting.crosshairSizeY.default}px;`)
                break;
            case "detectCrosshairSize":
                let C = document.getElementById("crosshair")
                let X = document.getElementById("crosshair").naturalWidth;
                let Y = document.getElementById("crosshair").naturalHeight;
                config.set("crosshairSizeX", X)
                config.set("crosshairSizeY", Y)
                C.setAttribute("style", `width:${X}px;height:${Y}px`);
                document.getElementById("rangecrosshairSizeX").value = X
                document.getElementById("rangecrosshairSizeY").value = Y
                document.getElementById("numcrosshairSizeX").value = X
                document.getElementById("numcrosshairSizeY").value = Y
                break;
            case "cssType":
                document.getElementById("customCSS") ? document.getElementById("customCSS").remove() : "";
                switch (value) {
                    case "none":
                        document.getElementById("customCSS") ? document.getElementById("customCSS").remove() : "";
                        break;
                    case "text":
                        document.body.insertAdjacentHTML("afterbegin", `<style id="customCSS">${config.get("cssTextarea") != null ? config.get("cssTextarea") : ""}</style>`)
                        break
                    case "localfile":
                        document.body.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" id="customCSS" href="vvc://${config.get("cssLocal") != null ? config.get("cssLocal") : ""}">`)
                        break;
                    case "online":
                        document.body.insertAdjacentHTML("afterbegin", `<style id="customCSS">@import url('${config.get("cssUrl") != null ? config.get("cssUrl") : ""}');</style>`)
                        break;
                }
            case "cssTextarea":
                config.get("cssType") === "text" ? document.getElementById("customCSS").innerText = value : "";
                break;
            case "cssLocal":
                config.get("cssType") === "localfile" ? document.getElementById("customCSS").setAttribute("href", "vvc://" + value) : "";
                break;
            case "cssUrl":
                config.get("cssType") === "online" ? document.getElementById("customCSS").innerText = `@import url('${value}')` : ""
                break;
            case "quickJoinRegion":
                break;
            case "quickJoinMode":
                break;
            case "disableSnow":
                value ? document.getElementById("snowStyle").innerText = ".snowflakes{display: none}" : document.getElementById("snowStyle").innerText = ".snowflakes{display: unset}";
                break;
            case "disableGemPopup":
                value ? document.getElementById("freeGem").innerText = ".ksWDWD{display:none !important}" : document.getElementById("freeGem").innerText = ".ksWDWD{display: unset}";
                break;
            case "enableCtW":
                break;
            case "webhookUrl":
                break;
            case "resourceSwapperEnable":
                break;
        }

    };
    sliderMove(id, value) {
        switch (id) {
            case "crosshairSizeX":
                document.getElementById("numcrosshairSizeX").value = value;
                if (value == null || value == "") {
                    document.getElementById("numcrosshairSizeX").value = 0;
                    document.getElementById("rangecrosshairSizeX").value = 0;
                }
                break;
            case "crosshairSizeY":
                document.getElementById("numcrosshairSizeY").value = value;
                if (value == null || value == "") {
                    document.getElementById("numcrosshairSizeY").value = 0;
                    document.getElementById("rangecrosshairSizeY").value = 0;
                }
                break;
        }
    };
    numInput(id, value) {
        switch (id) {
            case "crosshairSizeX":
                document.getElementById("rangecrosshairSizeX").value = value;
                if (value == null || value == "") {
                    document.getElementById("numcrosshairSizeX").value = 0;
                    document.getElementById("rangecrosshairSizeX").value = 0;
                }
                break;
            case "crosshairSizeY":
                document.getElementById("rangecrosshairSizeY").value = value;
                if (value == null || value == "") {
                    document.getElementById("numcrosshairSizeY").value = 0;
                    document.getElementById("rangecrosshairSizeY").value = 0;
                }
                break;
        }
    };
    openFile(id) {
        ipcRenderer.invoke("openFile").then((path) => {
            log.info(path)
            log.info(path[0])
            path != null ? config.set(id, path[0]) : ""
            this.setSetting(id, path[0])
        })
    };
    help() {
        shell.openExternal("https://namekujilsds.github.io/VVC")
    }
    exportGameSetting() {
        let setting = localStorage.getItem("persist:root");
        const blob = new Blob([setting], { type: 'text/plain' });
        const downloadLink = document.createElement('a')
        downloadLink.download = "Setting.txt";
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.click();
    }
    importGameSetting() {

    }
    settingCheck() {
        log.info(val.id, config.get(val.id));
    }
    quickJoin() {
        let url = `https://voxiom.io/find?region=${config.get("quickJoinRegion") != null ? config.get("quickJoinRegion") : setting.quickJoinRegion.default}&game_mode=${config.get("quickJoinMode") != null ? config.get("quickJoinMode") : setting.quickJoinMode.default}`
        fetch(url).then(responce => {
            return responce.json()
        }).then(data => {
            log.info(data.tag)
            location.href = `https://voxiom.io/#${data.tag}`
            location.reload()
        }).catch(e => { log.error(e) })
    }
    openMatchList() {
        const displayChange = () => {
            document.getElementById("matchList").classList.toggle("hide")
            document.getElementById("matchCloser").classList.toggle("hide")
        }
        const genUrls = () => {
            const reg = [0, 1, 2, 3];
            const mode = ["ctg", "br", "ffa", "svv"];
            const urls = [];
            for (let num of reg) {
                for (let m of mode) {
                    const url = `https://voxiom.io/find?region=${num}&game_mode=${m}`;
                    urls.push([num, m, url]);
                }
            }
            return urls;
        };
        displayChange()
        let url = genUrls()
        if (!document.getElementById("matchList").classList.contains("hide")) {
            document.getElementById('matchInfo').innerHTML = ""
            for (let array of url) {
                fetch(array[2]).then(result => {
                    return result.json()
                }).then(data => {
                    let temDom = `<tr>
                    <td>${array[0] === 0 ? "US-W" : array[0] === 1 ? "US-E" : array[0] === 2 ? "EU" : array[0] === 3 ? "Asia" : array[0]}</td >
                    <td>${array[1] === "svv" ? "Survival" : array[1] === "ffa" ? "FFA" : array[1] === "br" ? "BR" : array[1] === "ctg" ? "CTG" : array[1]}</td>
                    <td>https://voxiom.io/#${data.tag}</td>
                    <td onclick="navigator.clipboard.writeText('https://voxiom.io/#${data.tag}')">Copy</td>
                    <td onclick="window.location.replace('https://voxiom.io/#${data.tag}');location.reload() ">Join</td></tr>`
                    document.getElementById('matchInfo').insertAdjacentHTML("afterbegin", temDom)
                })
            }
        }
    }
    closeMatchList() {
        document.getElementById("matchList").classList.contains("hide") ? "" : document.getElementById("matchList").classList.add("hide")
        document.getElementById("matchCloser").classList.contains("hide") ? "" : document.getElementById("matchCloser").classList.add("hide")
    }
    joinGame() {
        document.getElementById("joinInput").value != null ? location.href = document.getElementById("joinInput").value : "";
        document.getElementById("joinInput").value != null ? location.reload() : ""
    }
};