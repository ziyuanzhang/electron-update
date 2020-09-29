const { app, BrowserWindow, dialog, ipcMain } = require('electron');

const updateHandle = require("./update.js");
console.log("updateHandle:", updateHandle)

function createWindow() {
    // 创建浏览器窗口
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.webContents.openDevTools();

    // 加载index.html文件
    win.loadFile('index.html')
    updateHandle(win);
}

app.on('ready', createWindow)
