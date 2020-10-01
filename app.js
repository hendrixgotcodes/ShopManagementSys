const {
    app,
    ipcMain,
    ipcRenderer
} = require('electron');
const MainWWindow = require('./controller/Windows/MainWindow');
let mainWindow;


function loadMainWindow() {
    const staticURL = require('url').format({
        protocol: 'file',
        slashes: true,
        path: require('path').join(__dirname, 'views')
    })

    //Path to icon 
    const icon = require('url').format({
        protocol: 'file',
        slashes: true,
        path: require('path').join(__dirname, 'views', 'icons', 'logo', 'logo.png')
    })


    mainWindow = new MainWWindow('./views/html/index.html', staticURL, icon);
    // mainWindow.loadFile('./views/html/index.html')

    mainWindow.on('enter-full-screen', () => {
        mainWindow.webContents.send('isFullScreen');
        console.log('is fullscreen');
    })

}

app.on('ready', () => {
    loadMainWindow();
    // mainWindow.setAlwaysOnTop(true, "floating", .5)
    // mainWindow.setAlwaysOnTop(false)
})

//Listening To Events Sent By the loginController
ipcMain.on('minimize', () => {
    mainWindow.minimize();
})

ipcMain.on('maximize', () => {
    mainWindow.maximize();
})

ipcMain.on('restore', () => {
    mainWindow.restore();
    console.log();
})

ipcMain.on('close', () => {
    app.quit()
})

ipcMain.on('loadStore', () => {
    mainWindow.loadFile('./views/html/Store.html');
})