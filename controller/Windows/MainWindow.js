const {
    BrowserWindow,
    globalShortcut
} = require('electron');

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


    }

}
//Exporting module
module.exports = MainWWindow;