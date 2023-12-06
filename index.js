const { app, log, Menu, BrowserWindow, protocol, ipcMain } = require('electron')
const autoUpdater = require("electron-updater")
const localShortcut = require("electron-localshortcut")
const path = require("path")


//Electron@9を使用するため、脆弱性の対策
delete require('electron').nativeImage.createThumbnailFromPath;
if (!app.requestSingleInstanceLock()) {
    log.error('Other process(es) are already existing. Quit. If you can\'t see the window, please kill all task(s).');
    app.exit();
}

// vvc://から始まるプロトコルの実装。ローカルファイルにアクセスしていろいろできるようにする
protocol.registerSchemesAsPrivileged([{
    scheme: 'vvc',
    privileges: {
        secure: true,
        corsEnabled: true
    }
}])

//ウィンドウの作成
function createWindow() {
    let gameWin = new BrowserWindow(
        {
            width: 1920,
            height: 1080,
            fullscreen: true,
            title: "Vanded Voxiom Client",
            icon: path.join(__dirname, "icon.ico"),
            webPreferences: {
                preload: path.join(__dirname, './preload/game.js'),
                enableRemoteModule: true,
                experimentalFeatures: true,
                enableHardwareAcceleration: true,
                contextIsolation: false
            },
        }
    );
    // ウインドウタイトルを固定する
    gameWin.setTitle('Vanded Voxiom Client');

    // ウインドウタイトルが変更されたときに、元のタイトルに戻す
    gameWin.on('titleChanged', () => {
        gameWin.setTitle('Vanded Voxiom Client');
    });
    Menu.setApplicationMenu(null);
    //ESCの実装。Preloadで受け取り
    localShortcut.register(gameWin, 'Esc', () => {
        gameWin.webContents.send("ESC");
    });
    localShortcut.register(gameWin, 'F5', () => {
        gameWin.reload();
    });
    localShortcut.register(gameWin, 'F8', () => {
        gameWin.loadURL("https://voxiom.io")
        // gameWin.reload();
        gameWin.webContents.loadURL("https://voxiom.io/experimental")
    });
    localShortcut.register(gameWin, "F11", () => {
        const isFS = gameWin.isFullScreen()
        gameWin.setFullScreen(!isFS);
    });
    localShortcut.register(gameWin, "F12", () => {
        gameWin.webContents.openDevTools();
    });

    //UAの設定
    // gameWin.webContents.setUserAgent(gameWin.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36");
    gameWin.webContents.loadURL("https://voxiom.io")

    app.on('close', () => {
        // gameWin = null;
        gameWin = null
        gameWin = new BrowserWindow()
        gameWin.destroy()
    })
    gameWin.onbeforeunload = (event) => {
        // イベントをキャンセルします。
        event.returnValue = true;
    };
}

//flags
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync');
app.commandLine.appendSwitch('in-process-gpu');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('enable-gpu-rasterization');

//app
app.on("ready", () => {
    createWindow()
});
app.on("ready", () => {
    protocol.registerFileProtocol('vvc', (request, callback) => callback(decodeURI(request.url.replace(/^vvc:\//, ''))));
})