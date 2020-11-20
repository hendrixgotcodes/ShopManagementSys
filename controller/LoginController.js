//Imports
const {
    ipcRenderer
} = require('electron');
const DATABASE = require('../model/DATABASE');
const Notifications = require('./Alerts/NotificationController');

const database = new DATABASE();


//DOM Elements
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');
const formBtn = document.querySelector('.form_btn');
const formCheck = document.querySelector('.form_check');
const tbUserName = document.querySelector('#username');
const password = document.querySelector('#password');
const visIcon = document.querySelector('.vis_icon');
const btnLoader = document.querySelector(".form_btn > img")

//Program Variables
let isFullScreen = false;
const userName = 'Maame Dufie'
const userType = 'Admin'



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

    console.log("in store");

    btnLoader.setAttribute("src", "../../utils/media/animations/loaders/Infinity-1s-200px.svg")
    btnLoader.classList.add("img_shown")

    database.validateUser(tbUserName.value, password.value)
    .then((result)=>{


        if(result === true){

                ipcRenderer.send('loadStore', [userName, userType]);

        }

    })
    .catch(()=>{

        Notifications.showAlert("error", "Sorry invalid password")

    })



   

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