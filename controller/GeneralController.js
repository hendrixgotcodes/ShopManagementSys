const { ipcRenderer } = require("electron");
const userType = 'Maame Dufie'


/*****************DOM ELEMENTS*****/
const goto_Store = document.querySelector('#goto_store')
const goto_Inventory = document.querySelector('#goto_inventory');
const goto_Analytics = document.querySelector('#goto_analytics');



/****************EVENT LISTENERS ********/
//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)
goto_Inventory.addEventListener('click',loadInventory)
goto_Analytics.addEventListener('click', loadAnalytics);


/*****************FUNCTIONS*****************/
//Triggers an event to load the pages in the  ipcMain
function loadStore(){
    ipcRenderer.send('loadStore', userType)
}

function loadInventory(){
    ipcRenderer.send('loadInventory',userType)
}

function loadAnalytics(){
    ipcRenderer.send('loadAnalytics',userType)
}
