//Imports
const {
    ipcRenderer
} = require('electron');



//DOM Elements
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');
const formBtn = document.querySelector('.form_btn');
const formCheck = document.querySelector('.form_check');
const password = document.querySelector('#password');
const visIcon = document.querySelector('.vis_icon');

//Program Variables
let isFullScreen = false;
const userType = 'Maame Dufie'



//Adding event listeners to trigger minimize, maximize and events in the mainWindow Controller
controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)
formBtn.addEventListener('click', loadStore);
formCheck.addEventListener('click', togglePassVisibility)




//Event Listeners From IPC
ipcRenderer.on('isFullScreen', () => {
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

function loadStore(e) {
    ipcRenderer.send('loadStore', userType);
}

//Function to toggle password visibility
function togglePassVisibility() {

    if (formCheck.checked == true) {
        password.type = 'text'
        visIcon.setAttribute('src', '../Icons/unwatch.svg')

    } else {
        password.type = 'password'
        visIcon.setAttribute('src', '../Icons/watch.svg')

    }

}