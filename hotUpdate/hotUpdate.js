
const { app, dialog } = require('electron');
const fs = require('fs');
var adm_zip = require('adm-zip');
var request = require('request');

const baseUrl = "./resources/app/";
const fileUrl = "http://192.168.1.6/hotUpDate/";//这里需要修改为自己的资源外网
let update = function (mainWindow) {

    request(
        {
            url: `${fileUrl}package.json?v=${new Date().getTime()}`,//请求package.json，与本地对比版本号
        },
        (error, res, body) => {

            try {
                if (error || res.statusCode !== 200) {
                    //throw '更新版本号失败，请联系管理员';
                    // mainWindow.webContents.send('packageNumFail', '更新版本号失败，请联系管理员')
                    dialog.showMessageBox({
                        type: 'info',
                        title: '检测版本号',
                        message: '更新版本号失败，请联系管理员',
                        buttons: ['确认']
                    })
                }
                const json = JSON.parse(body);
                const { version, description } = json;
                mainWindow.webContents.send('message', json)
                const localVersion = app.getVersion();
                mainWindow.webContents.send('message', {
                    json,
                    localVersion
                })
                if (version != localVersion) {
                    console.log('need update')
                    dialog.showMessageBox({
                        type: 'info',
                        title: '发现新版本',
                        message: '请点击按钮进行更新，预计持续几分钟，期间请不要操作，更新后会自动重启',
                        buttons: ['马上更新', '取消']
                    },
                        (index) => {
                            if (index == 0) {
                                mainWindow.webContents.send('updating', '更新中');
                                mainWindow.setProgressBar(0.5);
                                downLoad()
                                    .then(() => {
                                        console.log('update success')
                                        //重写版本号到本地
                                        fs.readFile(`${baseUrl}package.json`, function (err, data) {
                                            if (err) {
                                                return console.error(err);
                                            }
                                            let newData = JSON.parse(data);
                                            newData.version = version;
                                            fs.writeFile(`${baseUrl}package.json`, JSON.stringify(newData), function (err) {
                                                if (err) {
                                                    return console.error(err);
                                                }
                                                // 重启
                                                app.relaunch({ args: process.argv.slice(1) });
                                                app.exit(0);
                                            });
                                        });
                                    })
                            } else {
                            }
                        }
                    )

                } else {
                    console.log('no update')
                }
            } catch (err) { }
        })

}
/**
 * 更新
 */
const downLoad = () => {
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(`${baseUrl}temp/dist.zip`);
        const url = `${fileUrl}dist.zip?v=${new Date().getTime()}`;
        request(url).pipe(stream).on('close', () => {
            const unzip = new adm_zip(`${baseUrl}temp/dist.zip`);   //下载压缩更新包
            unzip.extractAllTo(`${baseUrl}`, /*overwrite*/true);   //解压替换本地文件
            resolve()
        });
    })
}

module.exports = update;