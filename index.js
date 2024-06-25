const { BrowserWindow, dialog, protocol, app, Menu, webContents, shell, ipcMain } = require("electron")
const path = require("path")
const store = require('electron-store')
const config = new store()
const shortcut = require("electron-localshortcut")
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const log = require('electron-log')

Object.defineProperty(app, 'isPackaged', {
    get() {
        return true
    }
})

let mainWindow
let settingWindow
let splashWindow

//カスタムプロトコルの登録
app.on('ready', () => {
    protocol.registerFileProtocol('vvc', (request, callback) =>
        callback(decodeURI(request.url.replace(/^vvc:\//, '')))
    )
})
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'vvc',
        privileges: {
            secure: true,
            corsEnabled: true
        }
    }
])
function createSplash() {
    splashWindow = new BrowserWindow({
        width: 600,
        height: 300,
        frame: false,
        resizable: false,
        show: false,
        transparent: true,
        alwaysOnTop: true,
        icon: "./icon.ico",
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, './js/pre-splash.js')
        }
    })
    splashWindow.loadFile(path.join(__dirname, 'html/splash.html'))
    Menu.setApplicationMenu(null)
    const update = async () => {
        let updateCheck = null
        autoUpdater.on('checking-for-update', () => {
            splashWindow.webContents.send('status', 'Checking for updates...')
            updateCheck = setTimeout(() => {
                splashWindow.webContents.send('status', 'Update check error!')
                setTimeout(() => {
                    createMain()
                }, 1000)
            }, 15000)
        })
        autoUpdater.on('update-available', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                `Found new version v${i.version}!`
            )
        })
        autoUpdater.on('update-not-available', () => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                'You are using the latest version!'
            )
            setTimeout(() => {
                createMain()
            }, 1000)
        })
        autoUpdater.on('error', e => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Error!' + e.name)
            setTimeout(() => {
                createMain()
            }, 1000)
        })
        autoUpdater.on('download-progress', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Downloading new version...')
        })
        autoUpdater.on('update-downloaded', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Update downloaded')
            setTimeout(() => {
                autoUpdater.quitAndInstall()
            }, 1000)
        })
        autoUpdater.autoDownload = 'download'
        autoUpdater.allowPrerelease = false
        autoUpdater.checkForUpdates()
    }
    splashWindow.webContents.on('did-finish-load', () => {
        splashWindow.show()
        update()
    })
}

//メインウィンドウを作るやつ
const createMain = () => {
    mainWindow = new BrowserWindow({
        x: config.get("x"),
        y: config.get("y"),
        height: config.get("height"),
        width: config.get("width"),
        show: false,
        icon: "./icon.ico",
        fullscreen: config.get("fullscreen", true),
        resizable: true,
        webPreferences: {
            webSecurity: false,
            contextIsolation: true,
            preload: path.join(__dirname, "./js/pre-game.js"),
            worldSafeExecuteJavaScript: false,
        },
    })
    let def = config.get("defPage") ? config.get("defPage") : "default"
    switch (def) {
        case ("default"):
            mainWindow.loadURL("https://voxiom.io/")
            break
        case ("experimental"):
            mainWindow.loadURL("https://voxiom.io/experimental")
            break
    }
    mainWindow.setTitle("Vanced Voxiom Client v" + app.getVersion())
    mainWindow.webContents.on('will-prevent-unload', e => {
        e.preventDefault()
    })
    //ショートカットキーを設定する
    shortcut.register(mainWindow, "F1", () => {
        settingDisplay("open")
    })
    shortcut.register(mainWindow, "F5", () => {
        mainWindow.webContents.send("reload")
    })
    shortcut.register(mainWindow, 'F11', () => {
        const isFullScreen = mainWindow.isFullScreen()
        config.set('Fullscreen', !isFullScreen)
        mainWindow.setFullScreen(!isFullScreen)
    })
    shortcut.register(mainWindow, "F12", () => {
        mainWindow.webContents.openDevTools()
    })
    shortcut.register(mainWindow, "0", () => {
        let v = config.get("betterDebugDisplay")
        mainWindow.webContents.send("betterDebugDisplay", v)
    })
    //表示の準備ができたらメインウィンドウを表示してスプラッシュウィンドウを破壊する
    mainWindow.once("ready-to-show", () => {
        config.get("maximize") ? mainWindow.maximize() : "";
        mainWindow.show()
        splashWindow.destroy()
        // createCrosshair()
    })
    //ページのタイトルを固定する
    mainWindow.on('page-title-updated', e => {
        e.preventDefault()
    })
    //メインウィンドウが前面に来た時に設定を隠す
    mainWindow.on('focus', () => {
        if (settingWindow) {
            settingWindow.hide()
        }
    })
    //閉じるときの処理
    mainWindow.on('close', () => {
        if (!mainWindow.isDestroyed()) {
            //座標などを保存する
            const { x, y, width, height } = mainWindow.getBounds()
            config.set({ x, y, width, height })
            config.set("fullscreen", mainWindow.isFullScreen())
            config.set("maximize", mainWindow.isMaximized())
            mainWindow.destroy()
        } try { settingWindow.close() } catch (e) { }
    });
    Menu.setApplicationMenu(null)
    //リソーススワップするやつ
    mainWindow.webContents.session.webRequest.onBeforeRequest(
        (details, callback) => {
            if (
                config.get('swapper') && files.includes(json[details.url])
            ) {
                callback({
                    redirectURL:
                        'vvc://' +
                        path.join(
                            app.getPath('documents'),
                            '/VVC-Swapper',
                            json[details.url]
                        )
                })
            } else {
                callback({})
            }
        }
    )
    //新しいウィンドウの挙動を変更する
    mainWindow.webContents.on("new-window", (e, v) => {
        console.log(e)
        console.log(v)
        e.preventDefault()
        if (v.startsWith("https://voxiom.io/assets/pages") || v.startsWith("https://voxiom.io/package")) {
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io") || v.startsWith("https://accounts.google.com/") || v.startsWith("https://discord.com/") || v.startsWith("https://www.facebook.com/")) {
            mainWindow.loadURL(v)
        } else {
            shell.openExternal()
        }
    });
    mainWindow.webContents.on('did-start-loading', e => {
        mainWindow.webContents.send("injectScript", config.get("customJs"))
    })
    mainWindow.webContents.on("will-navigate", (e, v) => {
        console.log(e)
        console.log(v)
        if (v.startsWith("https://voxiom.io/assets/pages")) {
            e.preventDefault()
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io/package")) {
            e.preventDefault()
            shell.openExternal(v)
        } else if (v.startsWith("https://voxiom.io") || v.startsWith("https://accounts.google.com/") || v.startsWith("https://discord.com/") || v.startsWith("https://www.facebook.com/")) {
            return
        } else {
            e.preventDefault()
            shell.openExternal(v)
        }
    })
}
//リソーススワッパーの部分
const swapperJson = () => {
    const filePath = swapper().includes('swapperConfig.json')
        ? path.join(app.getPath('documents'), '/VVC-Swapper', 'swapperConfig.json')
        : path.join(__dirname, 'js/swapperConfig.json')
    try {
        let data = fs.readFileSync(filePath, 'utf8')
        const jsonContent = JSON.parse(data)
        return jsonContent
    } catch (e) { }
}
const swapper = () => {
    const swapperPath = path.join(app.getPath('documents'), '/VVC-Swapper')
    if (!fs.existsSync(swapperPath)) {
        fs.mkdirSync(swapperPath, { recursive: true })
    }
    const fileNames = fs.readdirSync(swapperPath)
    return fileNames
}
let files = swapper()
let json = swapperJson()



//設定ウィンドウを開くやつ
const settingDisplay = (v) => {
    if (settingWindow) {
        settingWindow.show()
        log.info("settingWindow exist")
    } else if (!settingWindow) {
        log.info("settingWindow null")
        settingWindow = new BrowserWindow({
            height: 800,
            width: 750,
            x: 0,
            y: 0,
            icon: "./icon.ico",
            webPreferences: {
                contextIsolation: true,
                preload: path.join(__dirname, "./js/pre-setting.js"),
            }
        })
    }
    settingWindow.loadFile(path.join(__dirname, "./html/setting.html"))
    shortcut.register(settingWindow, "F12", () => {
        settingWindow.webContents.openDevTools()
    })
    settingWindow.on('close', function (e) {
        if (mainWindow.isDestroyed()) {
        } else if (!mainWindow.isDestroyed()) {
            e.preventDefault();
            settingWindow.hide();
        }
    })
}

//設定を保存したりpre-game.jsに送信するためのスクリプト
ipcMain.on("setting", (e, n, v) => {
    //設定を保存
    config.set(n, v)
    //mainWindowに送信している
    mainWindow.webContents.send("setSetting", n, v)
})
//設定を読み込む
ipcMain.on("loadSettings", (e, n) => {
    //設定を読み出し
    let v = config.get(n, true)
    //読みだした設定をsettingWindowに送信
    e.sender.send("loadedSetting", n, v)
})
//アプリのバージョンを返す
ipcMain.on("appVer", e => {
    e.sender.send("appVerRe", app.getVersion())
    // log.info("sender\n", e.sender)
})
//ゲームに参加する
ipcMain.on("joinGame", (e, v) => {
    // log.info(e, v)
    mainWindow.loadURL(v);
    settingWindow.hide()
})
//ゲームのリンクを取得する
ipcMain.handle("invLink", e => {
    // log.info(mainWindow.webContents.getURL())
    return mainWindow.webContents.getURL()
})
ipcMain.handle("getSetting", (e, n) => {
    // log.info(config.get(n, true))
    return config.get(n, true)
})
//リロードとリスタート
ipcMain.on("reload", e => {
    mainWindow.webContents.send("reload")
})
ipcMain.handle("getVal", (e, n) => {
    return config.get(n, "")
})
//クライアントの設定を初期化する
ipcMain.on("restore", e => {
    const { dialog } = require('electron')
    let options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        title: 'Restore client settings',
        message: 'Do you really want to restore client settings? This cannot be undone.',
    }
    dialog.showMessageBox(options).then((response) => {
        log.info("Restore setting " + response.response)
        switch (response.response) {
            case (0):
                log.info("0")
                config.clear()
                app.relaunch();
                app.exit();
                break
            case (1):
                log.info("Restore client setting is Cancelled")
                break
        }
    })
})
//cacheを削除する
ipcMain.on("clearCache", e => {
    let options = {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        title: 'Clear cache',
        message: 'After clearing the cache, the client will be restarted.',
    }
    dialog.showMessageBox(options).then((response) => {
        log.info("Clear cache " + response.response)
        switch (response.response) {
            case (0):
                session.defaultSession.clearCache()
                app.relaunch()
                app.exit()
                break
            case (1):
                log.info("Clear cache is Cancelled")
                break
        }
    })
})
//mainWindowでページがロードされたことを受け取る
ipcMain.on("pageLoaded", e => {
    mainWindow.webContents.send('crosshairGen', config.get('crosshair'), config.get('enableCrosshair', true))
    mainWindow.webContents.send('cssGen', config.get('customCSS', ""))
    mainWindow.webContents.send('fpsDisplay', config.get("fpsDisplay", true), config.get("fpsPosition"))
    mainWindow.webContents.send('appName', app.getVersion())
    mainWindow.webContents.send('loadJs', config.get("customJs", `console.log("Nothing Loaded")`))
})
ipcMain.on("openLink", (e, v) => {
    switch (v) {
        case ("voxiom"):
            let def = config.get("defPage") ? config.get("defPage") : "default";
            switch (def) {
                case ("default"):
                    mainWindow.loadURL("https://voxiom.io/")
                    break
                case ("experimental"):
                    mainWindow.loadURL("https://voxiom.io/experimental")
            }
            break;
        case ("addGoogle"):
            mainWindow.loadURL("https://accounts.google.com/v3/signin/identifier?flowName=GlifWebSignIn")
            break;
        case ("logGoogle"):
            mainWindow.loadURL("https://voxiom.io/auth/google")
            break;
        case ("addDiscord"):
            mainWindow.loadURL("https://discord.com/login")
            break;
        case ("logDiscord"):
            mainWindow.loadURL("https://voxiom.io/auth/discord")
            break;
        case ("addFacebook"):
            mainWindow.loadURL("https://facebook.com")
            break;
        case ("logFacebook"):
            mainWindow.loadURL("https://voxiom.io/auth/facebook")
            break;

    }
})
//いつもの
const initFlags = () => {
    const flaglist = [
        ['disable-frame-rate-limit', null, config.get('unlimitedFps', true)],
        ['use-angle', config.get('angleType', 'default'), true],
    ]
    flaglist.forEach(f => {
        const isEnable = f[2] ? 'Enable' : 'Disable'
        if (f[2]) {
            if (f[1] === null) {
                app.commandLine.appendSwitch(f[0])
            } else {
                app.commandLine.appendSwitch(f[0], f[1])
            }
        }
    })
    app.commandLine.appendSwitch("disable-gpu-vsync")
    app.commandLine.appendSwitch("in-process-gpu")
    app.commandLine.appendSwitch("enable-quic")
    app.commandLine.appendSwitch("enable-gpu-rasterization")
    app.commandLine.appendSwitch("enable-pointer-lock-options")
    app.commandLine.appendSwitch("enable-heavy-ad-intervention")
}
initFlags()
//起動時にコンフィグを確認する
const testConfigs = () => {
    console.log(config.get("crosshair"))
    // console.log(config.get("fpsDisplay"))
    // console.log(config.get("fpsPosition"))
    console.log(config.get("enableCrosshair"))
    console.log(config.get("unlimitedFps"))
    console.log(config.get("defPage"))
    console.log(config.get("swapper"))
    console.log(config.get("angleType"))
    console.log(config.get("customCSS"))
    console.log(config.get("betterDebugDisplay"))

    config.get("crosshair") ? log.info(config.get("crosshair")) : (config.set("crosshair", "https://namekujilsds.github.io/CROSSHAIR/img/Cross-lime.png"), log.info("Set value for crosshair"))
    // config.get("fpsDisplay") ? log.info(config.get("fpsDisplay")) : (config.set("fpsDisplay", true), log.info("Set value for fpsDisplay"))
    // config.get("fpsPosition") ? log.info(config.get("fpsPosition")) : (config.set("fpsPosition", "bottomRight"), log.info("Set value for fpsPosition"))
    config.get("enableCrosshair") ? log.info(config.get("enableCrosshair")) : (config.set("enableCrosshair", true), log.info("Set value for enableCrosshair"))
    config.get("unlimitedFps") ? log.info(config.get("unlimitedFps")) : (config.set("unlimitedFps", true), log.info("Set value for unlimitedFps"))
    config.get("defPage") ? log.info(config.get("defPage")) : (config.set("defPage", "default"), log.info("Set value for defPage"))
    config.get("swapper") ? log.info(config.get("swapper")) : (config.set("swapper", true), log.info("Set value for swapper"))
    config.get("angleType") ? log.info(config.get("angleType")) : (config.set("angleType", "default"), log.info("Set value for angleType"))
    config.get("customCSS") ? log.info(config.get("customCSS")) : (config.set("customCSS", "@import url('https://namekujilsds.github.io/VVC/default.css');"), log.info("Set value for customCSS"))
    config.get("betterDebugDisplay") ? log.info(config.get("betterDebugDisplay")) : (config.set("betterDebugDisplay", false), log.info("Set value for betterDebugDisplay"))
}
//アプリの準備ができたら保存されている設定を確認し、その後スプラッシュウィンドウを作成する
app.whenReady().then(() => {
    testConfigs()
    createSplash()
})