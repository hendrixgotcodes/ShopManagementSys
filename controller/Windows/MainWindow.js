const {
    BrowserWindow,
    globalShortcut,
    dialog,
    ipcMain,
    remote
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
                enableRemoteModule: true

            },
            center: true,
            frame: false,
            icon: icon,
            show: false,
            minWidth: 1503,
            minHeight: 800,
            hasShadow: true,
        })

        //Program Variables
        this.userType = null;
        this.userName = null;

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


/****************************************EVENT LISTENERS************************************/
        this.once('ready-to-show',()=>{

            this.show();

        })


            /***************Loads Program Pages */
            ipcMain.on('loadStore', (e, [userName, userType]) => {
                this.loadFile('./views/html/Store.html');

                this.userName = userName;
                this.userType = userType;
            });

            ipcMain.on('loadInventory',(e, [userName, userType])=>{
                this.loadFile('./views/html/inventory.html');

                this.userName = userName;
                this.userType = userType;
            });

            ipcMain.on('loadAnalytics',(e, [userName, userType])=>{
                this.loadFile('./views/html/analytics.html');  
                
                this.userName = userName;
                this.userType = userType;
            });

            ipcMain.on('loadProfits',(e, [userName, userType])=>{
                this.loadFile('./views/html/profits.html');    
                
                this.userName = userName;
                this.userType = userType;
            });

            ipcMain.on('loadLogin',()=>{
                this.loadFile('./views/html/index.html')
            })


        /*********************OPENS FILE EXPLORER*******************/
            ipcMain.on("openFileExplorer",(e)=>{

                dialog.showOpenDialog(
                    {
                    title: 'Select File',
                    filters: [
                        { name: 'Excel Files (.xls, .xlsx)', extensions: ['xlsx', 'xls'] },
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


        
        /*********************RESPONDS TO AN EVENT TO SEND AN EVENT TO POPULATE TABLE ROWS*******************/
        ipcMain.on('populateTable', (e, Items)=>{
                this.webContents.send('populateTable', Items);
        })


        /*********************RESPONDS TO READINESS************/

        ipcMain.on("ready", ()=>{

            this.webContents.send("loadUserInfo", [this.userName, this.userType])
        })


    }



}
//Exporting module
module.exports = MainWWindow;