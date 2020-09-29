"build": { // 这里是 electron-builder 的配置
"productName":"xxxx",//项目名 这也是生成的 exe 文件的前缀名
"appId": "com.xxx.xxxxx",//包名  
 "copyright":"xxxx",//版权 信息
"directories": { // 输出文件夹
"output": "build"
},
// windows 相关的配置
"win": {  
 "icon": "xxx/icon.ico"//图标路径
}  
 }

"nsis": {
"oneClick": false, // 是否一键安装
"allowElevation": true, // 允许请求提升。 如果为 false，则用户必须使用提升的权限重新启动安装程序。
"allowToChangeInstallationDirectory": true, // 允许修改安装目录
"installerIcon": "./build/icons/aaa.ico",// 安装图标
"uninstallerIcon": "./build/icons/bbb.ico",//卸载图标
"installerHeaderIcon": "./build/icons/aaa.ico", // 安装时头部图标
"createDesktopShortcut": true, // 创建桌面图标
"createStartMenuShortcut": true,// 创建开始菜单图标
"shortcutName": "xxxx", // 图标名称
"include": "build/script/installer.nsh", // 包含的自定义 nsis 脚本 这个对于构建需求严格得安装过程相当有用。
"script" : "build/script/installer.nsh" // NSIS 脚本的路径，用于自定义安装程序。 默认为 build / installer.nsi  
},
