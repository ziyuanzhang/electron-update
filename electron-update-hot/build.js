
var electronInstaller = require('electron-winstaller');
var path = require("path");

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/hotupdate-win32-x64',//path.join('./build/hotupdate-win32-x64'), //刚才生成打包文件的路径
    outputDirectory: path.join('./build'), //输出路径
    authors: 'zzy', // 作者名称
    exe: 'hotUpdate.exe', //在appDirectory寻找exe的名字
    setupIcon: path.join('./icons/aaa.ico'),//安装图标，必须本地
    iconUrl: 'http://pm72qibzx.bkt.clouddn.com/icon.ico',//程序图标，必须url
    noMsi: true, //不需要mis![这里写图片描述]
    description: 'MyApp',
});

resultPromise.then(
    () => console.log("It worked!")
).catch(
    (e) => console.log(`No dice: ${e.message}`)
);
