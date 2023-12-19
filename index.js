const {
    app,
    log,
    Menu,
    BrowserWindow,
    protocol,
    ipcMain,
    shell,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const localShortcut = require("electron-localshortcut");
const path = require("path");
const { clearTimeout } = require("timers");
const clientID = "1186209799935889469";
const DiscordRPC = require("discord-rpc");
const RPC = new DiscordRPC.Client({ transport: "ipc" });
DiscordRPC.register(clientID);

function setActiv() {
    const time = Date.now();
    if (!RPC) return;
    RPC.setActivity({
        state: "on Vanced Voxiom Client",
        details: "Playing Voxiom.io",
        startTimestamp: time,
        largeImageKey: "vvclogo",
        largeImageText: `Vanced Voxiom Client`,
        instance: false,
        buttons: [{
            label: `Get Vanced Voxiom Client`,
            url: `https://namekujilsds.github.io/VVC/`,
        },
        {
            label: `VVC Support Server`,
            url: `https://discord.gg/EcZytWAJkn`,
        },
        ],
    });
}

RPC.on("ready", () => {
    setActiv();
});

RPC.login({ clientId: clientID }).catch(console.error);

let gameWin = null;
let splashWin = null;

//Electron@9を使用するため、脆弱性の対策
delete require("electron").nativeImage.createThumbnailFromPath;
if (!app.requestSingleInstanceLock()) {
    log.error(
        "Other process(es) are already existing. Quit. If you can't see the window, please kill all task(s)."
    );
    app.exit();
}

// ビルドしてなくてもしてるように見せかける
// Object.defineProperty(app, "isPackaged", {
//     get() {
//         return true;
//     },
// });

// vvc://から始まるプロトコルの実装。ローカルファイルにアクセスしていろいろできるようにする
protocol.registerSchemesAsPrivileged([{
    scheme: "vvc",
    privileges: {
        secure: true,
        corsEnabled: true,
    },
},]);

function createSplash() {
    splashWin = new BrowserWindow({
        show: false,
        frame: false,
        width: 600,
        height: 300,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, "splashWin/preload.js"),
        },
    });
    const update = async () => {
        let updateCheck = null;
        autoUpdater.on("checking-for-update", () => {
            splashWin.webContents.send("status", "Checking for updates...");
            updateCheck = setTimeout(() => {
                splashWin.webContents.send("status", "Update check error!");
                setTimeout(() => {
                    createWindow();
                }, 1000);
            }, 15000);
        });
        autoUpdater.on("update-available", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", `Found new verison v${i.version}!`);
        });
        autoUpdater.on("update-not-available", () => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", "You are using the latest version!");
            setTimeout(() => {
                createWindow();
            }, 1000);
        });

        autoUpdater.on("error", (e) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", "Error!" + e.name);
            setTimeout(() => {
                createWindow();
            }, 1000);
        });
        autoUpdater.on("download-progress", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", "Downloading new version...");
        });
        autoUpdater.on("update-downloaded", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWin.webContents.send("status", "Update downloaded");
            setTimeout(() => {
                autoUpdater.quitAndInstall();
            }, 1000);
        });
        autoUpdater.autoDownload = "download";
        autoUpdater.allowPrerelease = false;
        autoUpdater.checkForUpdates();
    };
    // スプラッシュ用のHTMLを表示
    splashWin.loadFile(path.join(__dirname, "splashWin/splash.html"));

    // 準備が整ったら表示
    splashWin.webContents.on("did-finish-load", () => {
        splashWin.show();
        update();
    });
}

//ウィンドウの作成
function createWindow() {
    gameWin = new BrowserWindow({
        width: 1920,
        height: 1080,
        fullscreen: true,
        show: false,
        title: "Vanded Voxiom Client",
        icon: path.join(__dirname, "icon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "./preload/game.js"),
            enableRemoteModule: true,
            experimentalFeatures: true,
            enableHardwareAcceleration: true,
            contextIsolation: false,
        },
    });
    Menu.setApplicationMenu(null);
    //ESCの実装。Preloadで受け取り
    localShortcut.register(gameWin, "Esc", () => {
        gameWin.webContents.send("ESC");
    });
    localShortcut.register(gameWin, "F5", () => {
        gameWin.reload();
    });
    localShortcut.register(gameWin, "F6", () => {
        gameWin.webContents.send("F6");
    });
    localShortcut.register(gameWin, "F8", () => {
        gameWin.webContents.send("F8");
    });
    localShortcut.register(gameWin, "F11", () => {
        const isFS = gameWin.isFullScreen();
        gameWin.setFullScreen(!isFS);
    });
    localShortcut.register(gameWin, "F12", () => {
        gameWin.webContents.openDevTools();
    });
    gameWin.webContents.loadURL("https://voxiom.io");

    gameWin.once("ready-to-show", () => {
        splashWin.destroy();
        gameWin.show();
    });
}

//flags
app.commandLine.appendSwitch("disable-frame-rate-limit");
app.commandLine.appendSwitch("disable-gpu-vsync");
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-quic");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-pointer-lock-options");

//app
app.whenReady().then(() => {
    // スプラッシュを最初に表示
    createSplash();
});

app.on("ready", () => {
    protocol.registerFileProtocol("vvc", (request, callback) =>
        callback(decodeURI(request.url.replace(/^vvc:\//, "")))
    );
});

ipcMain.handle("appVer", () => {
    const version = app.getVersion();
    return version;
});