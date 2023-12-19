let logoUrl = "";
let bgUrl = "";
let subTitle = "";
let xYSize = "";
let xXSize = "";
let xUrl = "";
let css = "";
let menuDisplay = "";
let overlaySwitch = "";
let dfg = "";
let dfs = "";
let webhookUrl = "";

//ローカルからの設定の読み取り
function configs() {
    let firstTime = localStorage.getItem("firstTime");
    if (firstTime == null) {
        vvcReset();
        localStorage.setItem("firstTime", "no");
    }
    logoUrl = localStorage.getItem("logoUrl");
    bgUrl = localStorage.getItem("bgUrl");
    subTitle = localStorage.getItem("subTitle");
    xXSize = localStorage.getItem("xXSize");
    xYSize = localStorage.getItem("xYSize");
    xUrl = localStorage.getItem("xUrl");
    css = localStorage.getItem("css");
    overlayUrl = localStorage.getItem("overlayUrl");
    menuDisplay = localStorage.getItem("menuDisplay");
    overlaySwitch = localStorage.getItem("overlayOnOff");
    dfg = localStorage.getItem("dfg");
    dfs = localStorage.getItem("dfs");
    webhookUrl = localStorage.getItem("webhookUrl")
}

//全部リセットする
function vvcReset() {
    localStorage.setItem(
        "logoUrl",
        "https://cdn.discordapp.com/attachments/983598732505411595/1181131421830623312/image_3-min.png"
    );
    localStorage.setItem(
        "bgUrl",
        "https://cdn.discordapp.com/attachments/983598732505411595/1181099378149175358/image_13_1.png"
    );
    localStorage.setItem("subTitle", "DIE FOR DIE");
    localStorage.setItem("xXSize", "20");
    localStorage.setItem("xYSize", "20");
    localStorage.setItem(
        "xUrl",
        "https://cdn.discordapp.com/attachments/920182601761832980/920182755025907762/Cross_-_yellow.png"
    );
    localStorage.setItem("css", "");
    localStorage.setItem("menuDisplay", true);
    localStorage.setItem("overlay", "");
    localStorage.setItem("overlayOnOff", true);
    localStorage.setItem("dfg", false);
    localStorage.setItem("dfs", false);
    localStorage.setItem("webhookUrl", null)
}

// タイトルがロードされたときの処理
function onLoadMod() {
    configs();
    document.getElementsByClassName("sc-iaUyqC")[0].setAttribute("src", logoUrl);
    document
        .getElementsByClassName("sc-gKclnd")[0]
        .setAttribute("style", `background-image:url("${bgUrl}")`);
    document.getElementsByClassName("sc-kdneuM")[0].textContent = subTitle;
}

//設定メニュー自体の追加
function addSettingMenu() {
    let tempDom = `<a onclick="menuHide()" class="visible" id="hideturn"></a>
    <div id="settingBox">
        <h1>VANCED VOXIOM CLIENT</h1>
        <div id="miniTitle">
            GameLink
        </div>
        <div class="setVal">
            <div class="minibox">
                Join
                <div id="boxinbox">
                    <input type="url" name="URL" id="joinURL" placeholder="Put game link here">
                    <input type="button" value="JOIN" onclick="location.href = document.getElementById('joinURL').value">
                </div>
            </div>
            <div class="minibox">
                <a id="copyBtn" type="button" onclick="copyURL()">COPY LINK</a>
            </div>
        </div>
    
        <div id="miniTitle">
            Logo and BG
        </div>
        <div class="setVal">
            <div class="minibox">
                LogoURL
                <input type="url" name="URL" id="logoUrl" oninput="vvcSettingChange('logo')">
            </div>
            <div class="minibox">
                LogoText
                <input type="text" name="TEXT" id="subTitle" oninput="vvcSettingChange('subt')">
            </div>
            <div class="minibox">
                BGURL
                <input type="text" name="TEXT" id="BGURL" oninput="vvcSettingChange('bg')">
            </div>
        </div>
        <div id="miniTitle">
            Crosshair
        </div>
        <div class="setVal">
            <div class="minibox">
                CrosshairURL
                <input type="url" name="URL" id="xUrlInput" oninput="vvcSettingChange('xurl')">
            </div>
            <div class="minibox">
                Size X
                <div id="boxinbox">
                    <input type="range" name="RANGE" id="xXrange" min="0" max="256" oninput="vvcSettingChange('xxr')">
                    <input type="number" name="NUM" id="xXnum" class="num" oninput="vvcSettingChange('xxn')">
                </div>
            </div>
            <div class="minibox">
                Size Y
                <div id="boxinbox">
                    <input type="range" name="RANGE" id="xYrange" min="0" max="256" oninput="vvcSettingChange('xyr')">
                    <input type="number" name="NUM" id="xYnum" class="num" oninput="vvcSettingChange('xyn')">
                </div>
            </div>
            <div class="minibox">
                Reset size
                <input type="button" value="RESET!" onclick="resetXsize()">
            </div>
            <div class="minibox">
                Overlay
                <input type="url" name="URL" id="overlayInput" oninput="vvcSettingChange('ovl')">
            </div>
            <div class="minibox">
                Enable Overlay
                <input type="checkbox" name="CHECKBOX" id="overlayOnoff" oninput="vvcSettingChange('ovs')">
            </div>
        </div>
        <div id="miniTitle">
            CSS
        </div>
        <div class="setVal">
            <div class="minibox TtB css">
                Enter CSS below
                <textarea name="TA" id="customCSS" cols="30" rows="10" oninput="vvcSettingChange('css')"></textarea>
            </div>
        </div>
        <div id="miniTitle">
            Mini Tools
        </div>
        <div class="setVal">
            <div class="minibox">
                Disable Free Gem Popup
                <input type="checkbox" name="CHECKBOX" id="dfg" oninput="vvcSettingChange('dfg')">
            </div>
            <div class="minibox">
                Disable Snowflakes
                <input type="checkbox" name="CHECKBOX" id="dfs" oninput="vvcSettingChange('dfs')">
            </div>
        </div>
        <div id="miniTitle">
            Social Logins
        </div>
        <div class="setVal">
            <div class="minibox">
                <a href="https://voxiom.io/" id="loginOut">Back to Voxiom</a>
            </div>
            <div class="minibox">
                <a href="https://google.com/" id="loginOut">Open Google</a>
            </div>
            <div class="minibox">
                <a href="https://discord.com/login" id="loginOut">Open Discord</a>
            </div>
            <div class="minibox">
                <a href="https://www.facebook.com/login/" id="loginOut">Open Facebook</a>
            </div>
        </div>
        <div id="miniTitle">
            Dangerous Setting
    
        </div>
        <div class="setVal">
            <div class="minibox">
                Chat to Webhook
                <input type="text" name="" id="webhookUrlInput" oninput="vvcSettingChange('webhook')">
            </div>
            <div class="minibox">
                <a onclick="resetAsk()" id="reset">RESET CLIENT SETTINGS</a>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", tempDom);
    let tempDom2 = `<img id="crosshair">`;
    let tempDom3 = `<style id="injectCSS"></style>`;
    let tempDom5 = `<img id="overlay">`;
    let tempDom6 = `<style id="dfgcss"></style>`;
    let tempDom7 = `<style id="dfscss"></style>`;
    let tempDom8 = `<div id="matchList" style="display:none">
  <div id="matchListTitleBar">
      <div id="matchListTitle">Match List Console (WIP)</div>
      <div id="matchListCloser" onclick="listClose()">
          <span class="material-symbols-outlined">
              close
          </span>
      </div>
  </div>
  <div id="listBox">
  </div>
</div>`;
    let tempDom9 = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />`;
    document.body.insertAdjacentHTML("afterbegin", tempDom2);
    document.body.insertAdjacentHTML("afterbegin", tempDom3);
    document.body.insertAdjacentHTML("afterbegin", tempDom5);
    document.body.insertAdjacentHTML("afterbegin", tempDom6);
    document.body.insertAdjacentHTML("afterbegin", tempDom7);
    document.getElementById("app").insertAdjacentHTML("afterbegin", tempDom8);
    document.head.insertAdjacentHTML("afterbegin", tempDom9);
    configs();
    menuDisplayInit();
    menuItemInit();
    titleSetter();
}
//サーバーリストを閉じるやつ
const listClose = () => {
    document.getElementById("matchList").setAttribute("style", "display:none");
};
//ウィンドウタイトルをうんちゃらするためのやつ
titleSetter = () => {
    document.getElementsByTagName("title")[0].innerText = "Vanced Voxiom Client";
};

//メニューの表示の初期設定
function menuDisplayInit() {
    let setBox = document.getElementById("settingBox");
    let checkBox = document.getElementById("hideturn");
    if (localStorage.getItem("menuDisplay") == "true") {
        setBox.setAttribute("style", "display:flex");
        checkBox.setAttribute("class", "visible");
        console.log("true");
    } else if (localStorage.getItem("menuDisplay") == "false") {
        setBox.setAttribute("style", "display:none");
        checkBox.setAttribute("class", "hidden");
        console.log("false");
    }
}

//メニューの中身を初期設定
function menuItemInit() {
    const logoUrlInput = document.getElementById("logoUrl");
    const bgUrlInput = document.getElementById("BGURL");
    const subTitleInput = document.getElementById("subTitle");
    const xUrlInput = document.getElementById("xUrlInput");
    const cssInput = document.getElementById("customCSS");
    const xXnum = document.getElementById("xXnum");
    const xXrange = document.getElementById("xXrange");
    const xYnum = document.getElementById("xYnum");
    const xYrange = document.getElementById("xYrange");
    const injCSS = document.getElementById("injectCSS");
    const crosshair = document.getElementById("crosshair");
    const overlayUrlInput = document.getElementById("overlayInput");
    const overlay = document.getElementById("overlay");
    const overlaySwitching = document.getElementById("overlayOnoff");
    const dfgCheck = document.getElementById("dfg");
    const dfsCheck = document.getElementById("dfs");
    const dfgcss = document.getElementById("dfgcss");
    const dfscss = document.getElementById("dfscss");
    const webhookUrlInput = document.getElementById("webhookUrlInput")

    console.log(logoUrl);
    logoUrlInput.value = logoUrl;
    console.log(bgUrl);
    bgUrlInput.value = bgUrl;
    console.log(subTitle);
    subTitleInput.value = subTitle;
    console.log(css);
    cssInput.value = css;
    console.log(xUrl);
    xUrlInput.value = xUrl;
    console.log(xXSize);
    xXnum.value = xXSize;
    xXrange.value = xXSize;
    console.log(xYSize);
    xYnum.value = xYSize;
    xYrange.value = xYSize;
    crosshair.setAttribute("src", xUrl);
    crosshair.setAttribute("style", `width:${xXSize}px;height:${xYSize}px`);
    document
        .getElementsByClassName("sc-gKclnd")[0]
        .setAttribute("style", `background-image:url("${bgUrl}")`);
    injCSS.textContent = css;
    overlayUrlInput.value = overlayUrl;
    overlay.setAttribute("src", overlayUrl);
    if (overlaySwitch === "true") {
        overlay.setAttribute("style", "display:block");
        overlaySwitching.checked = true;
    } else if (overlaySwitch === "false") {
        overlay.setAttribute("style", "display:none");
        overlaySwitching.checked = false;
    }
    if (dfg === "true") {
        dfgcss.innerText = `.ksWDWD{display:none !important}`;
        dfgCheck.checked = true;
    } else if (dfg === "false") {
        dfgcss.innerText = ``;
        dfgCheck.checked = false;
    }
    if (dfs === "true") {
        dfscss.innerText = `.snowflake,.snowflake .inner{animation:none !important;display:none !important}`;
        dfsCheck.checked = true;
    } else if (dfs === "false") {
        dfscss.innerText = ``;
        dfsCheck.checked = false;
    }
    webhookUrlInput.value = webhookUrl;
}

//メニューに変更があった時のアレ
function vvcSettingChange(val) {
    const logoUrlInput = document.getElementById("logoUrl");
    const bgUrlInput = document.getElementById("BGURL");
    const subTitleInput = document.getElementById("subTitle");
    const xUrlInput = document.getElementById("xUrlInput");
    const cssInput = document.getElementById("customCSS");
    const xXnum = document.getElementById("xXnum");
    const xXrange = document.getElementById("xXrange");
    const xYnum = document.getElementById("xYnum");
    const xYrange = document.getElementById("xYrange");
    const crosshair = document.getElementById("crosshair");
    const injCSS = document.getElementById("injectCSS");
    const overlayUrlInput = document.getElementById("overlayInput");
    const overlay = document.getElementById("overlay");
    const overlaySwitching = document.getElementById("overlayOnoff");
    const dfgCheck = document.getElementById("dfg");
    const dfsCheck = document.getElementById("dfs");
    const dfgcss = document.getElementById("dfgcss");
    const dfscss = document.getElementById("dfscss");
    const webhookUrlInput = document.getElementById("webhookUrlInput")

    if (val == "logo") {
        localStorage.setItem("logoUrl", logoUrlInput.value);
        document
            .getElementsByClassName("sc-iaUyqC")[0]
            .setAttribute("src", logoUrlInput.value);
    } else if (val == "subt") {
        localStorage.setItem("subTitle", subTitleInput.value);
        document.getElementsByClassName("sc-kdneuM")[0].textContent =
            subTitleInput.value;
    } else if (val == "bg") {
        localStorage.setItem("bgUrl", bgUrlInput.value);
        document
            .getElementsByClassName("sc-gKclnd")[0]
            .setAttribute("style", `background-image:url("${bgUrlInput.value}")`);
    } else if (val == "xurl") {
        localStorage.setItem("xUrl", xUrlInput.value);
        document.getElementById("crosshair").setAttribute("src", xUrlInput.value);
    } else if (val == "xxr") {
        localStorage.setItem("xXSize", xXrange.value);
        xXnum.value = xXrange.value;
        crosshair.setAttribute(
            "style",
            `width:${xXrange.value}px;height:${xYrange.value}px`
        );
    } else if (val == "xxn") {
        localStorage.setItem("xXSize", xXnum.value);
        xXrange.value = xXnum.value;
        crosshair.setAttribute(
            "style",
            `width:${xXnum.value}px;height:${xYnum.value}px`
        );
    } else if (val == "xyr") {
        localStorage.setItem("xYSize", xYrange.value);
        xYnum.value = xYrange.value;
        crosshair.setAttribute(
            "style",
            `width:${xXrange.value}px;height:${xYrange.value}px`
        );
    } else if (val == "xyn") {
        localStorage.setItem("xYSize", xYnum.value);
        xYrange.value = xYnum.value;
        crosshair.setAttribute(
            "style",
            `width:${xXnum.value}px;height:${xYnum.value}px`
        );
    } else if (val == "css") {
        localStorage.setItem("css", cssInput.value);
        injCSS.innerText = cssInput.value;
    } else if (val == "ovl") {
        localStorage.setItem("overlayUrl", overlayUrlInput.value);
        overlay.setAttribute("src", overlayUrlInput.value);
    } else if (val == "ovs") {
        if (overlaySwitching.checked) {
            console.log(overlaySwitching.checked);
            overlay.setAttribute("style", "display:block");
            localStorage.setItem("overlayOnOff", "true");
        } else if (!overlaySwitching.checked) {
            console.log(overlaySwitching.checked);
            overlay.setAttribute("style", "display:none");
            localStorage.setItem("overlayOnOff", "false");
        }
    } else if (val == "dfg") {
        if (dfgCheck.checked) {
            dfgcss.innerText = `.ksWDWD{display:none !important}`;
            localStorage.setItem("dfg", true);
        } else if (!dfgCheck.checked) {
            dfgcss.innerText = ``;
            localStorage.setItem("dfg", false);
        }
    } else if (val == "dfs") {
        if (dfsCheck.checked) {
            dfscss.innerText = `.snowflake,.snowflake .inner{animation:none !important;display:none !important}`;
            localStorage.setItem("dfs", true);
        } else if (!dfsCheck.checked) {
            dfscss.innerText = ``;
            localStorage.setItem("dfs", false);
        }
    } else if (val === "webhook") {
        localStorage.setItem("webhookUrl", webhookUrlInput.value)
    }
}
//リセットするかの確認
function resetAsk() {
    const result = confirm("Are you sure you want RESET settings?");
    if (result) {
        console.log("Reset");
        vvcReset();
        configs();
        menuItemInit();
        location.reload();
    } else {
        console.log("Canceled");
    }
}

//クロスヘアサイズリセット
function resetXsize() {
    const xXnum = document.getElementById("xXnum");
    const xXrange = document.getElementById("xXrange");
    const xYnum = document.getElementById("xYnum");
    const xYrange = document.getElementById("xYrange");
    const crosshair = document.getElementById("crosshair");
    localStorage.setItem("xXSize", crosshair.naturalWidth);
    localStorage.setItem("xYSize", crosshair.naturalHeight);

    xXnum.value = crosshair.naturalWidth;
    xXrange.value = crosshair.naturalWidth;
    xYrange.value = crosshair.naturalHeight;
    xYnum.value = crosshair.naturalHeight;
    crosshair.setAttribute(
        "style",
        `width:${crosshair.naturalWidth}px;height:${crosshair.naturalHeight}px`
    );
}

//ロゴの要素が追加されるまで監視する
//オプション
const options = {
    childList: true, //直接の子の変更を監視
    characterData: true, //文字の変化を監視
    characterDataOldValue: true, //属性の変化前を記録
    attributes: true, //属性の変化を監視
    subtree: true, //全ての子要素を監視
};

//コールバック関数
function callback(mutationsList, observer) {
    for (const mutation of mutationsList) {
        const tags = mutation.target;
        for (const node of tags.querySelectorAll("img")) {
            if (node.getAttribute("class") === "sc-iaUyqC hrxbol") {
                obs.disconnect();
                const logoText = document.getElementsByClassName("yYlig")[0];
                logoText.textContent = subTitle;
                const logo = document.getElementsByClassName("hrxbol")[0];
                logo.setAttribute("src", logoUrl);
            }
        }
    }
}

const observer2 = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList") {
            const addedNodes = mutation.addedNodes;
            for (const node of addedNodes) {
                if (node.getAttribute("class") === "sc-jWWnA ekvAMc") {
                    sendWebhook(node.innerText);
                }
            }
        }
    }
});

const sendWebhook = (txt) => {
        whUrl = document.getElementById('webhookUrlInput').value
        let gameurl = window.location.href
        const req = {
            content: `${txt}`,
            username: `VVC[${gameurl}]`,
            avatar_url: "https://i.imgur.com/bdClDSq.png",

        };
        fetch(whUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req),
        })
    }
    //ターゲット要素をDOMで取得
const target = document.getElementById("app");
//インスタンス化
const obs = new MutationObserver(callback);

//ターゲット要素の監視を開始
obs.observe(target, options);
observer2.observe(target, options)

//メニュー画面の表示切替
function menuHide() {
    if (localStorage.getItem("menuDisplay") === "true") {
        document
            .getElementById("settingBox")
            .setAttribute("style", "display:none;");
        document.getElementById("hideturn").setAttribute("class", "hidden");
        localStorage.setItem("menuDisplay", false);
        console.log("Set to false");
    } else if (localStorage.getItem("menuDisplay") === "false") {
        document
            .getElementById("settingBox")
            .setAttribute("style", "display:flex;");
        document.getElementById("hideturn").setAttribute("class", "visible");
        localStorage.setItem("menuDisplay", true);
        console.log("Set to true");
    }
}

function copyURL() {
    // 現在のページのURLを取得
    var url = window.location.href;

    // ページのURLをクリップボードにコピーする処理
    navigator.clipboard
        .writeText(url)
        .then(function() {
            // コピー成功時の処理
            document.getElementById("copyBtn").innerText = "COPIED!!";
            setTimeout(function() {
                document.getElementById("copyBtn").innerText = "COPY LINK";
            }, 3000); // 3秒後に元のテキストに戻す
        })
        .catch(function(err) {
            // コピー失敗時の処理
            console.error("URLのコピーに失敗しました: ", err);
        });
}

setInterval(() => (onbeforeunload = null), 1000);
window.onload = addSettingMenu();

//ESCキーの調整
let exitTime = Date.now();
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        setTimeout(() => {
            document.activeElement.blur();
            document.exitPointerLock();
            // exitPointerlockを実行した時間の記録
            exitTime = Date.now();
        }, 200);
    }
});
// ポインターロックの試行を検出する
document.addEventListener("pointerlockchange", function(event) {
    // exitPointerlockを実行してから0.1秒以内の場合は、ブロックする
    if (Date.now() - exitTime < 100) {
        event.preventDefault();
    }
});