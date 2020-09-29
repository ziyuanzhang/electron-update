// 注意这个autoUpdater不是electron中的autoUpdater
const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, dialog, ipcMain } = require('electron');

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(mainWindow) {
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };

    autoUpdater.setFeedURL("http://192.168.1.6:80/update");
    autoUpdater.on('error', function (error) {
        sendUpdateMessage(mainWindow, message.error)
    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(mainWindow, message.checking)
    });
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(mainWindow, message.updateAva)
    });
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(mainWindow, message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
        mainWindow.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        dialog.showMessageBox(null, {
            type: "info",
            title: "是否现在更新？",
            buttons: ['ok', 'cancel']
        }, (index) => {
            if (index == 0) {
                console.log('You click ok.');
                mainWindow.webContents.send('isUpdateNow')
            } else {
                console.log('You click cancel');
            }
        })


    });

    ipcMain.on("checkForUpdate", () => {
        //执行自动更新检查
        autoUpdater.checkForUpdates();
    }),
        ipcMain.on('UpdateNow', (e, arg) => {
            console.log("开始更新");
            //some code here to handle event
            autoUpdater.quitAndInstall();
        });

}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(mainWindow, text) {
    // dialog.showMessageBox(null, {
    //     type: "info",
    //     title: "更新提示",
    //     message: text
    // })
    mainWindow.webContents.send('message', text)
}
module.exports = updateHandle;