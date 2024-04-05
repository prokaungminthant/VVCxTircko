const {
    app,
    Menu,
    BrowserWindow,
    protocol,
    ipcMain,
    dialog,
    Electron
} = require('electron')
const fs = require('fs')
const { autoUpdater } = require('electron-updater')
const localShortcut = require('electron-localshortcut')
const path = require('path')
const store = require('electron-store')
const DiscordRPC = require('discord-rpc')
const log = require('electron-log')
const { detectCrosshairSize } = require('./js/util/setting')
const { warn } = require('console')
const config = new store()
const clientID = '1186209799935889469'
const RPC = new DiscordRPC.Client({ transport: 'ipc' })
const appVer = app.getVersion()
//バージョンの取得
ipcMain.handle('appVer', () => {
    return appVer
})
ipcMain.handle('cacheClear', () => {
    Electron.session.defaultSession.clearCache()
})
let splashWindow
let mainWindow
// ビルドしてなくてもしてるように見せかける
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true
    }
})
//ファイルを開く
ipcMain.handle('openFile', () => {
    let path = dialog.showOpenDialogSync(null, {
        properties: ['openFile'],
        title: 'VVC FILE OPEN',
        defaultPath: '.',
        filters: [
            {
                name: 'StyleSheet',
                extensions: ['css', 'txt']
            }
        ]
    })
    log.info('path', path)
    return path
})

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

function versionResetCheck() {
    let version = appVer
    let lastVer = config.get('appVersion')
    if (lastVer != version) {
        if (
            config.get('customBG') ===
            "https://cdn.discordapp.com/attachments/983598732505411595/1181099378149175358/image_13_1.png'"
        ) {
            config.delete('customBG')
        }
        if (
            config.get('customCrosshairImage') ===
            'https://cdn.discordapp.com/attachments/616206938048561152/996062796892614716/KovaaK-Crosshair_1.png'
        ) {
            config.delete('customCrosshairImage')
        }
        if (
            config.get('customLogo') ===
            'https://cdn.discordapp.com/attachments/983598732505411595/1181131421830623312/image_3-min.png'
        ) {
            config.delete('customLogo')
        }
    }
    config.set('appVersion', version)
}

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
            preload: path.join(__dirname, 'js/preload/splash.js')
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
                    createMainWindow()
                }, 1000)
            }, 15000)
        })
        autoUpdater.on('update-available', i => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                `Found new verison v${i.version}!`
            )
        })
        autoUpdater.on('update-not-available', () => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send(
                'status',
                'You are using the latest version!'
            )
            setTimeout(() => {
                createMainWindow()
            }, 1000)
        })
        autoUpdater.on('error', e => {
            if (updateCheck) clearTimeout(updateCheck)
            splashWindow.webContents.send('status', 'Error!' + e.name)
            setTimeout(() => {
                createMainWindow()
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

function createMainWindow() {
    versionResetCheck()
    mainWindow = new BrowserWindow({
        fullscreen: config.get('Fullscreen')
            ? true
            : config.get('Fullscreen') == null
                ? true
                : false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'js/preload/game.js'),
            enableHardwareAcceleration: true,
            enableRemoteModule: true
            //　↓絶対にお前だけは許さない
            // contextIsolation: true
            //　↑絶対にお前だけは許さない
        }
    })
    mainWindow.title = 'Vanced Voxiom Client v' + appVer
    Menu.setApplicationMenu(null)
    //ショートカットの登録
    localShortcut.register(mainWindow, 'Esc', () => {
        mainWindow.webContents.send('ESC')
    })
    localShortcut.register(mainWindow, 'F1', () => {
        mainWindow.send('F1')
    })
    localShortcut.register(mainWindow, 'F4', () => {
        mainWindow.send('F4')
    })
    localShortcut.register(mainWindow, 'F5', () => {
        mainWindow.reload()
    })
    localShortcut.register(mainWindow, 'F6', () => {
        mainWindow.send('F6')
    })
    localShortcut.register(mainWindow, 'F8', () => {
        mainWindow.send('F8')
    })
    localShortcut.register(mainWindow, 'F10', () => {
        mainWindow.send('F10')
    })
    localShortcut.register(mainWindow, 'F11', () => {
        const isFullScreen = mainWindow.isFullScreen()
        config.set('Fullscreen', !isFullScreen)
        mainWindow.setFullScreen(!isFullScreen)
    })
    localShortcut.register(mainWindow, 'F12', () => {
        mainWindow.webContents.openDevTools()
    })
    //ページを閉じられるようにする。
    mainWindow.webContents.on('will-prevent-unload', e => {
        e.preventDefault()
    })
    mainWindow.webContents.loadURL('https://voxiom.io')
    //準備ができたら表示
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        splashWindow.destroy()
    })
    mainWindow.on('page-title-updated', e => {
        e.preventDefault()
    })
    mainWindow.webContents.on('did-navigate-in-page', (event, url) => {
        mainWindow.send('url', url)
    })
    //リソーススワッパーここから
    let rejectRequest = rejectJson()
    let regPattern = rejectRequest.reject.map(pattern => new RegExp(pattern))
    let files = swapper()
    let json = swapperJson()
    mainWindow.webContents.session.webRequest.onBeforeRequest(
        (details, callback) => {
            if (
                config.get('resourceSwapperEnable') &&
                files.includes(json[details.url])
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
                log.info(json[details.url])
            } else if (regPattern.some(regex => regex.test(details.url))) {
                callback({ cancel: true })
                log.info('BLOCKED', details.url)
            } else {
                callback({})
            }
        }
    )
}
const rejectJson = () => {
    const filePath = swapper().includes('rejectConfig.json')
        ? path.join(app.getPath('documents'), '/VVC-Swapper', 'rejectConfig.json')
        : path.join(__dirname, 'js/rejectConfig.json')
    try {
        let data = fs.readFileSync(filePath, 'utf8')
        const jsonContent = JSON.parse(data)
        return jsonContent
    } catch (e) {
        log.info(e)
    }
}
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
const initFlags = () => {
    const flaglist = [
        // FPS解放周り
        ['disable-frame-rate-limit', null, config.get('unlimitedFPS', true)],
        ['disable-gpu-vsync', null, config.get('unlimitedFPS', true)],
        // 描画関係
        ['use-angle', config.get('angleType', 'default'), true],
        ['enable-webgl2-compute-context', null, config.get('webgl2Context', true)],
        [
            'disable-accelerated-2d-canvas',
            'true',
            !config.get('acceleratedCanvas', true)
        ],
        // ウィンドウキャプチャに必要な設定
        ['in-process-gpu', null, config.get('inProcessGpu'), true],
        // その他
        [
            'autoplay-policy',
            'no-user-gesture-required',
            config.get('autoPlay', true)
        ],
        ['enable-quic', null, config.get('quic'), true],
        ['enable-gpu-rasterization', null, null],
        ['enable-pointer-lock-options', null, null],
        ['enable-heavy-ad-intervention', null, null]
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
}
initFlags()

app.whenReady().then(() => {
    createSplashWindow()
    const today = new Date()
    const dateString =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate() +
        '-' +
        today.getHours() +
        '-' +
        today.getMinutes() +
        '-' +
        today.getSeconds()
    const logString = dateString + '_VVC-main.log'
    log.transports.file.fileName = `${logString}`
})

process.on('uncaughtException', e => {
    log.warn(e)
})
