"use strict";

const { ipcRenderer } = require("electron");
const userType = 'Maame Dufie'

let isFullScreen = false;


/*****************DOM ELEMENTS*****/
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');

const goto_Store = document.querySelector('#goto_store')
const goto_Inventory = document.querySelector('#goto_inventory');
const goto_Analytics = document.querySelector('#goto_analytics');

const content_cover = document.querySelector('.contentCover')
const mainBodyContent = document.querySelector('.mainBody_content')



/****************EVENT LISTENERS ********/
controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)



//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)
goto_Inventory.addEventListener('click',loadInventory)
goto_Analytics.addEventListener('click', loadAnalytics);

//For Content
content_cover.addEventListener("click", removeModal)


/*****************FUNCTIONS*****************/
function sendMinimizeEvent() {
    ipcRenderer.send('minimize')

}

function sendMaximizeEvent() {
    if (isFullScreen === true) {
        ipcRenderer.send("restore")
        restoreMaxi.setAttribute('src', "../Icons/Control_Box/Maximize.png")
        isFullScreen = false;
    } else {
        restoreMaxi.setAttribute('src', "../Icons/Control_Box/Restore.png")
        isFullScreen = true
        ipcRenderer.send('maximize')
    }

}

function sendCloseEvent() {
    ipcRenderer.send('close')
}




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

//Removes Modal
function removeModal(){
    if(mainBodyContent.querySelector('.modal') !== null){
        mainBodyContent.querySelector('.modal').remove();
        document.querySelector('.contentCover').classList.remove('contentCover--shown')
    }
}