const {
    app,
    BrowserWindow,
    globalShortcut,
    dialog,
    ipcMain,
    remote,
} = require('electron');

//Loading directory which contains static files


class MainWWindow extends BrowserWindow {
    constructor(indexFile, staticURL, icon, width, height) {
        //Passing parameter to actual electron BrowserWindow Object
        super({
            width,
            height,
            webPreferences: {
                nodeIntegration: true,
                enableRemoteModule: true

            },
            center: true,
            frame: false,
            icon: icon,
            show: false,
            minWidth: width/2,
            minHeight: height/2,
            hasShadow: true,
            alwaysOnTop: false
        })

        //Program Variables
        this.userType = null;
        this.userName = null;

        //Loading file to window and pointing to static directory

        this.loadURL(staticURL);
        this.loadFile(indexFile);

        const that = this;
        this.allowRendererProcessReuse = false;
        


/****************************************EVENT LISTENERS************************************/
        


            /***************Loads Program Pages */
            ipcMain.on('loadStore', (e, [userName, userType]) => {
                this.loadFile('./views/html/Store.html');

                this.userName = userName;
                this.userType = userType;

                

            });

            ipcMain.on('loadStoreRA', (e, [userName, userType]) => {
                this.loadFile('./views/html/StoreRA.html');

                this.userName = userName;
                this.userType = userType;

                

            });

            ipcMain.on('loadInventory',(e, [userName, userType])=>{

                this.loadFile('./views/html/inventory.html');
                
            });

            ipcMain.on('loadAnalytics',(e, [userName, userType])=>{
                
                this.loadFile('./views/html/analytics.html');  
            
            });

            ipcMain.on("loadEmployees", (e)=>{

                this.loadFile('./views/html/employees.html')

            });

            ipcMain.on('loadProfits',(e, [userName, userType])=>{
                
                this.loadFile('./views/html/profits.html');    
                
            });

            ipcMain.on('loadLogin',()=>{
                
                this.loadFile('./views/html/index.html')
            })

            ipcMain.on('loadGrowthRate',()=>{
                
                this.loadFile('./views/html/maingraph.html')
            })

            ipcMain.on('loadTopItems',()=>{
                
                this.loadFile('./views/html/topItems.html')
            })

            ipcMain.on('loadEmployeePerformance',()=>{

                this.loadFile('./views/html/employeePerformance.html')

            })

            ipcMain.on('sendUserParams', (e)=>{

                this.webContents.send("setUserParams", [this.userName, this.userType])

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

        this.once('ready-to-show',()=>{

            this.show();

        })


/************************EVENT SENDERS********************************/
        globalShortcut.register("ctrl+s", ()=>{

            this.webContents.send("ctrlS_pressed")

        })

        globalShortcut.register("ctrl+c", ()=>{

            this.webContents.send("ctrlC_pressed")

        })
    }



}
//Exporting module
module.exports = MainWWindow;