const {
    BrowserWindow,
    globalShortcut,
    dialog,
    ipcMain
} = require('electron');
const { remote } = require('electron/renderer');

//Loading directory which contains static files


class MainWWindow extends BrowserWindow {
    constructor(indexFile, staticURL, icon) {
        //Passing parameter to actual electron BrowserWindow Object
        super({
            width: 1500,
            height: 800,
            webPreferences: {
                nodeIntegration: true,

            },
            center: true,
            frame: false,
            icon: icon,
        })

        //Program Variables
        let userType = null;

        //Loading file to window and pointing to static directory

        this.loadURL(staticURL);
        this.loadFile(indexFile);

        const that = this;
        globalShortcut.register('cmdorctrl+d', () => {
            that.webContents.toggleDevTools();
        })

        globalShortcut.register('ctrl+r', () => {
            that.reload();
        })


        /*********************OPENS FILE EXPLORER*******************/
            ipcMain.on("openFileExplorer",(e)=>{

                dialog.showOpenDialog({
                    title: 'Select File',
                    filters: [
                        { name: 'Excel Files', extensions: ['xlsx'] },
                    ],
                    properties: [
                        "openFile",
                        "multiSelections"
                    ],
                    message: 'Choose an excel file containing data of your shop items'
                }).then((result)=>{
                    this.webContents.send("serveFilePath",result.filePaths)
                })
            })


    }



}
//Exporting module
module.exports = MainWWindow;