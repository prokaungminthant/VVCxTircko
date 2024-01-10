const { ipcRenderer } = require('electron');
const store = require('electron-store');
const log = require('electron-log');
const path = require('path');
const vvcTool = require('../util/tool');
const { stringify } = require('querystring');

const tools = new vvcTool.clientTools()


const config = new store()
const tool = new vvcTool.settingTool();

//ページロード時のあれこれを
document.addEventListener('DOMContentLoaded', () => {
    //url変更を検知
    tools.urlChanged(location.href)
    if (location.origin === "https://voxiom.io") {
        tools.setupClientSetting();
        tools.initDoms()
    }
    document.body.insertAdjacentHTML("beforeend", tools.vvcSettingStyleInject());
    window.tool = new vvcTool.settingTool()
    // 条件に一致するノードの中身を書き換える関数
    const observerCallback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            mutation.addedNodes.forEach(addedNode => {
                nodeCheck(addedNode);
                if (addedNode.className === "sc-jWWnA ekvAMc") {
                    tools.sendWebhook(addedNode)
                } else if (addedNode.className === "sc-fIEHcE fsQUZP") {
                    log.info("open esc menu");
                    let tempDom = `<div id=escJoin><input id=joinInput> <input onclick='Window.tool.joinGame()'type=button value=JOIN></div><div id=escCopy><input onclick=navigator.clipboard.writeText(location.href) type=button value="Copy Link"></div>`
                    document.getElementsByClassName("hmiDqW")[0].insertAdjacentHTML("afterend", tempDom);
                } else if (addedNode.className === "sc-halPKt hOLpQX") {
                    log.info("sc-halPKt hOLpQX")
                    let tempDom = `<div id="escJoin"><input type="text" id="joinInput"><input type="button" value="JOIN" onclick="window.tool.joinGame('joinInput')"></div>`
                    document.getElementsByClassName('fRtCid')[0].insertAdjacentHTML("afterend", tempDom)
                }
            });
        }
    }
    const targetNode = document.getElementById("app");
    const observer = new MutationObserver(observerCallback);
    const observerConfig = { childList: true, subtree: true };
    // 対象のノードと設定を渡して監視を開始
    observer.observe(targetNode, observerConfig);

    const nodeCheck = (node) => {
        let allChild = (node) => {
            testClass(node)
            node.hasChildNodes() ? allChild2(node.childNodes) : testClass(node)
        }
        let allChild2 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild3(val.childNodes) : testClass(node) }
        }
        let allChild3 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild4(val.childNodes) : testClass(node) }
        }
        let allChild4 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild5(val.childNodes) : testClass(node) }
        }
        let allChild5 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild6(val.childNodes) : testClass(node) }
        }
        let allChild6 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild7(val.childNodes) : testClass(node) }
        }
        let allChild7 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild8(val.childNodes) : testClass(node) }
        }
        let allChild8 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild9(val.childNodes) : testClass(node) }
        }
        let allChild9 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? allChild10(val.childNodes) : testClass(node) }
        }
        let allChild10 = (node) => {
            testClass(node)
            for (val of node) { val.hasChildNodes() ? exporting(val.childNodes) : testClass(node) }
        }
        let exporting = (node) => {
            testClass(node)
            for (val of node) { testClass(node) }
        }
        allChild(node)

        function testClass(node) {
            if (node.length != null) {
                for (i = 0; i <= node.length; i++) {
                    try {
                        if (node[i].className === "sc-eldieg lfDZCd") {
                            let dom = document.getElementsByClassName("lfDZCd")[0];
                            dom.innerHTML = `<div id=login><a class=discord href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Discord</a> <a class=google href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Google</a> <a class=facebook href=http://voxiom.io/auth/google2 id=loginBtn target=_self>Sign in with Facebook</a></div><style>#loginBtn{text-align:center;padding:10px;text-decoration:none;color:#fff;margin-bottom:10px;width:200px;display:flex;-webkit-box-align:center;align-items:center;cursor:pointer}.discord{background-color:#7289da}.google{background-color:#ea4435}.facebook{background-color:#4967aa}.discord:hover{background-color:#8da6ff}.google:hover{background-color:#ff6a5c}.facebook:hover{background-color:#658be2}</style>`
                        } else if (node[i].className === "sc-kdneuM yYlig") {
                            tools.initTitleText()
                        } else if (node[i].id.includes("voxiom-io")) {
                            node[i].remove()
                        } else if (node[i].nodeName.toLocaleLowerCase() === "ins") {
                            node[i].remove()
                        } else if (node[i].id.includes("gpt_unit")) {
                            node[i].remove()
                        }
                    } catch (error) { }
                }
            }
        }
    }
})

ipcRenderer.on("ESC", () => {
    setTimeout(() => {
        document.exitPointerLock()
    }, 100);
})
ipcRenderer.on("F1", () => {
    window.tool.closeSetting()
})
ipcRenderer.on("F6", () => {
    window.tool.quickJoin()
})
ipcRenderer.on("F8", () => {
    window.tool.openMatchList()
})
ipcRenderer.on("url", (e, u) => {
    tools.urlChanged(u)
})