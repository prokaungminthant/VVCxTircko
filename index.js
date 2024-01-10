const {
    app,
    Menu,
    BrowserWindow,
    protocol,
    ipcMain,
    dialog,
    Electron
} = require("electron");
const fs = require('fs');
const { autoUpdater } = require("electron-updater");
const localShortcut = require("electron-localshortcut");
const path = require("path");
const store = require('electron-store');
const DiscordRPC = require("discord-rpc");
const log = require('electron-log');
const { detectCrosshairSize } = require("./js/util/setting");
const { warn } = require("console");
const config = new store();
const clientID = "1186209799935889469";
const RPC = new DiscordRPC.Client({ transport: "ipc" });
const appVer = app.getVersion()
//バージョンの取得
ipcMain.handle("appVer", () => {
    return appVer
});
ipcMain.handle("cacheClear", () => {
    Electron.session.defaultSession.clearCache()
})
let splashWindow
let mainWindow
// ビルドしてなくてもしてるように見せかける
Object.defineProperty(app, "isPackaged", {
    get() {
        return true;
    },
});
//ファイルを開く
ipcMain.handle("openFile", () => {
    let path = dialog.showOpenDialogSync(null, {
        properties: ["openFile"],
        title: "VVC FILE OPEN",
        defaultPath: ".",
        filters: [{
            name: "StyleSheet",
            extensions: ["css", "txt"]
        }]
    });
    log.info("path", path)
    return path
})

//カスタムプロトコルの登録
app.on("ready", () => {
    protocol.registerFileProtocol("vvc", (request, callback) =>
        callback(decodeURI(request.url.replace(/^vvc:\//, "")))
    );
});
protocol.registerSchemesAsPrivileged([{
    scheme: "vvc",
    privileges: {
        secure: true,
        corsEnabled: true,
    },
},]);

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 600,
        height: 300,
        frame: false,
        resizable: false,
        show: false,
        transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, "js/preload/splash.js")
        },
    });
    splashWindow.loadFile(path.join(__dirname, "html/splash.html"));
    Menu.setApplicationMenu(null)
    const update = async () => {
        let updateCheck = null;
        autoUpdater.on("checking-for-update", () => {
            splashWindow.webContents.send("status", "Checking for updates...");
            updateCheck = setTimeout(() => {
                splashWindow.webContents.send("status", "Update check error!");
                setTimeout(() => {
                    createMainWindow();
                }, 1000);
            }, 15000);
        });
        autoUpdater.on("update-available", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWindow.webContents.send("status", `Found new verison v${i.version}!`);
        });
        autoUpdater.on("update-not-available", () => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWindow.webContents.send("status", "You are using the latest version!");
            setTimeout(() => {
                createMainWindow();
            }, 1000);
        });
        autoUpdater.on("error", (e) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWindow.webContents.send("status", "Error!" + e.name);
            setTimeout(() => {
                createMainWindow();
            }, 1000);
        });
        autoUpdater.on("download-progress", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWindow.webContents.send("status", "Downloading new version...");
        });
        autoUpdater.on("update-downloaded", (i) => {
            if (updateCheck) clearTimeout(updateCheck);
            splashWindow.webContents.send("status", "Update downloaded");
            setTimeout(() => {
                autoUpdater.quitAndInstall();
            }, 1000);
        });
        autoUpdater.autoDownload = "download";
        autoUpdater.allowPrerelease = false;
        autoUpdater.checkForUpdates();
    };
    splashWindow.webContents.on("did-finish-load", () => {
        splashWindow.show();
        update();
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: config.get("Fullscreen"),
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "js/preload/game.js"),
            enableHardwareAcceleration: true,
            enableRemoteModule: true,
            //　↓絶対にお前だけは許さない
            // contextIsolation: true
            //　↑絶対にお前だけは許さない
        },
    });
    mainWindow.title = "Vanced Voxiom Client v" + appVer
    Menu.setApplicationMenu(null);
    //ショートカットの登録
    localShortcut.register(mainWindow, "Esc", () => {
        mainWindow.webContents.send("ESC")
    })
    localShortcut.register(mainWindow, "F1", () => {
        mainWindow.send("F1")
    })
    localShortcut.register(mainWindow, "F4", () => {
        mainWindow.send("F4")
    })
    localShortcut.register(mainWindow, "F5", () => {
        mainWindow.reload()
    })
    localShortcut.register(mainWindow, "F6", () => {
        mainWindow.send("F6")
    })
    localShortcut.register(mainWindow, "F8", () => {
        mainWindow.send("F8")
    })
    localShortcut.register(mainWindow, "F11", () => {
        const isFullScreen = mainWindow.isFullScreen();
        config.set('Fullscreen', !isFullScreen);
        mainWindow.setFullScreen(!isFullScreen);
    })
    localShortcut.register(mainWindow, "F12", () => {
        mainWindow.webContents.openDevTools()
    })
    //ページを閉じられるようにする。
    mainWindow.webContents.on('will-prevent-unload', (e) => {
        e.preventDefault()
    })
    mainWindow.webContents.loadURL("https://voxiom.io");
    //準備ができたら表示
    mainWindow.once("ready-to-show", () => {
        splashWindow.destroy();
        mainWindow.show()
    })
    mainWindow.on("page-title-updated", (e) => {
        e.preventDefault()
    })
    mainWindow.webContents.on("did-navigate-in-page", (event, url) => {
        mainWindow.send("url", url)
    })
    //リソーススワッパーここから
    mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
        let files = swapper()
        if (config.get("resourceSwapperEnable")) {
            if (details.url === "https://voxiom.io/package/de6274e78db1a53c703d.mp3" && files.includes("C-AR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'C-AR.mp3') })
            } else if (details.url === "https://voxiom.io/package/ae1a5a5599b6af9ec128.mp3" && files.includes("T-AR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'T-AR.mp3') })
            } else if (details.url === "https://voxiom.io/package/0239fee9ab387355072c.mp3" && files.includes("S-AR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'S-AR.mp3') })
            } else if (details.url === "https://voxiom.io/package/138ec2b79dc2f7019b7e.mp3" && files.includes("E-AR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'E-AR.mp3') })
            } else if (details.url === "https://voxiom.io/package/59ee55d2d7f1d521b29d.mp3" && files.includes("H-SR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'H-SR.mp3') })
            } else if (details.url === "https://voxiom.io/package/681138ccec4c3f23a591.mp3" && files.includes("L-SR.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'L-SR.mp3') })
            } else if (details.url === "https://voxiom.io/package/c5425a46ee081156a170.mp3" && files.includes("L-SMG.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'L-SMG.mp3') })
            } else if (details.url === "https://voxiom.io/package/66e3ea5ff5b532a32c71.mp3" && files.includes("C-SMG.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'C-SMG.mp3') })
            } else if (details.url === "https://voxiom.io/package/9827a8320cbcfcc19254.mp3" && files.includes("BURST.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'BURST.mp3') })
            } else if (details.url === "https://voxiom.io/package/658fbaae950919f843b8.mp3" && files.includes("PISTOL.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'PISTOL.mp3') })
            } else if (details.url === "https://voxiom.io/package/1a714d4ecb0fc068c2bc.mp3" && files.includes("MAGNUM.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'MAGNUM.mp3') })
            } else if (details.url === "https://voxiom.io/package/d6d5be65465643ffbdfc.mp3" && files.includes("KILL.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'KILL.mp3') })
            } else if (details.url === "https://voxiom.io/package/a5afd201eb5c5abf621b.mp3" && files.includes("HIT.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'HIT.mp3') })
            } else if (details.url === "https://voxiom.io/package/7188d9a8c8a09ab9936e.mp3" && files.includes("HIT-HEAD.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'HIT-HEAD.mp3') })
            } else if (details.url === "https://voxiom.io/package/ad6949ab40e7252565dd.mp3" && files.includes("COUNTDOWN.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'COUNTDOWN.mp3') })
            } else if (details.url === "https://voxiom.io/package/16d0167f832e1b29b0e8.mp3" && files.includes("DAMAGE.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'DAMAGE.mp3') })
            } else if (details.url === "https://voxiom.io/package/d381117b446c6f5779e4.mp3" && files.includes("GRASS.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'GRASS.mp3') })
            } else if (details.url === "https://voxiom.io/package/c4798765bd538e771540.mp3" && files.includes("LEAF.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'LEAF.mp3') })
            } else if (details.url === "https://voxiom.io/package/47da41fafd1793328f3f.mp3" && files.includes("WOOD.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'WOOD.mp3') })
            } else if (details.url === "https://voxiom.io/package/77e4aeb8db8c136f7da7.mp3" && files.includes("DIRT.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'DIRT.mp3') })
            } else if (details.url === "https://voxiom.io/package/79e936b332ac2b9daae6.mp3" && files.includes("STONE-BRICK.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'STONE-BRICK.mp3') })
            } else if (details.url === "https://voxiom.io/package/8c43e7e02c189d53af0e.mp3" && files.includes("STONE.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'STONE.mp3') })
            } else if (details.url === "https://voxiom.io/package/269d71a551e0714bfe96.mp3" && files.includes("WATER-1.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'WATER-1.mp3') })
            } else if (details.url === "https://voxiom.io/package/2bca215d3525ffe521d3.mp3" && files.includes("WATER-2.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'WATER-2.mp3') })
            } else if (details.url === "https://voxiom.io/package/2f3378ca37adab35de22.mp3" && files.includes("CRATE.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'CRATE.mp3') })
            } else if (details.url === "https://voxiom.io/package/3a1099dfff5f38855672.mp3" && files.includes("GAMEEND.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'GAMEEND.mp3') })
            } else if (details.url === "https://voxiom.io/package/46bee7053f6ea8bca110.mp3" && files.includes("DENIED.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'DENIED.mp3') })
            } else if (details.url === "https://voxiom.io/package/5b11619669c073298081.mp3" && files.includes("SPRAY.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'SPRAY.mp3') })
            } else if (details.url === "https://voxiom.io/package/67fd45879fa008bd15f9.mp3" && files.includes("TNT-FIRE.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'TNT-FIRE.mp3') })
            } else if (details.url === "https://voxiom.io/package/6b7698eca47a7e7231fb.mp3" && files.includes("TNT-BOOM.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'TNT-BOOM.mp3') })
            } else if (details.url === "https://voxiom.io/package/f06b7e9c578d865af0ff.mp3" && files.includes("DROP-COLLECT.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'DROP-COLLECT.mp3') })
            } else if (details.url === "https://voxiom.io/package/0513564d081549305880.mp3" && files.includes("SAND.mp3")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'SAND.mp3') })
            } else if (details.url === "https://voxiom.io/package/cb1d14c1ff0efb6a282b.png" && files.includes("SOLDIER.png")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'SOLDIER.png') })
            } else if (details.url === "https://voxiom.io/package/aef55bdd0c3c3c3734f8.png" && files.includes("RED.png")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'RED.png') })
            } else if (details.url === "https://voxiom.io/package/ecca1227c2e0406be225.png" && files.includes("BLUE.png")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'BLUE.png') })
            } else if (details.url === "https://voxiom.io/package/9223b6316bedee5652fb.png" && files.includes("INDICATOR.png")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'INDICATOR.png') })
            } else if (details.url === "https://voxiom.io/package/edbaf3d94f4c091bbfc0.png" && files.includes("LOGO-SPRAY.png")) {
                callback({ redirectURL: "vvc://" + path.join(app.getPath('documents'), '/VVC-Swapper', 'LOGO-SPRAY.png') })
            } else {
                callback({})
            }
        } else {
            callback({})
        }
    })
}
const swapper = () => {
    const swapperPath = path.join(app.getPath('documents'), '/VVC-Swapper')
    if (!fs.existsSync(swapperPath)) {
        fs.mkdirSync(swapperPath, { recursive: true }, e => {
            log.warn("Error in swapper", e)
        })
    }
    const fileNames = fs.readdirSync(swapperPath)
    return fileNames
}
//flags
app.commandLine.appendSwitch("disable-frame-rate-limit");
app.commandLine.appendSwitch("disable-gpu-vsync");
app.commandLine.appendSwitch("in-process-gpu");
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-quic");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-pointer-lock-options");

app.whenReady().then(() => {
    createSplashWindow()
})