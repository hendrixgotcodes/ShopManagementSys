const {
    ipcRenderer
} = require('electron');
let isFullScreen = false;
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');
const formBtn = document.querySelector('.form_btn');

//Adding event listeners to trigger minimize, maximize and events in the mainWindow Controller
controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)
formBtn.addEventListener('click', loadStore);

//Event Listeners From IPC
ipcRenderer.on('isFullScreen',()=>{
    restoreMaxi.setAttribute('src', "../Icons/Control_Box/Restore.png")
    isFullScreen = true
})


//Functions Being Called
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

function loadStore(e){
    ipcRenderer.send('loadStore');
}