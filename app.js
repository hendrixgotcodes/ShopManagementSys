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
});

app.on('window-all-closed',()=>{
    app.quit();
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


/***************Loads Program Pages */
ipcMain.on('loadStore', (e, userType) => {
    mainWindow.loadFile('./views/html/Store.html');
    mainWindow.userType = userType;
});

ipcMain.on('loadInventory',(e, userType)=>{
    mainWindow.loadFile('./views/html/inventory.html');
    mainWindow.userType = userType;
    console.log(mainWindow.userType);
});

ipcMain.on('loadAnalytics',(e, userType)=>{
    mainWindow.loadFile('./views/html/analytics.html');
    mainWindow.userType = userType;
    console.log(mainWindow.userType);
});

