"use strict";

const { ipcRenderer } = require("electron");
import DATABASE from '../model/DATABASE';
import STORE from '../model/STORE';
import Modal from './modals/ModalController';
const DOMCONTROLLER = require("./utilities/TableController");


const database = new DATABASE();


//Program Variables
let UserName;
let UserType;
let isFullScreen = false;
let logOutTimeOut = 30000;
let timeOutValue;
let searchtimeOutValue;




/*****************DOM ELEMENTS*****/
const mainBody = document.querySelector('body');
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');

const goto_Store = document.querySelector('#goto_store')
const goto_Inventory = document.querySelector('#goto_inventory');
const goto_Analytics = document.querySelector('#goto_analytics');
const goto_Employees = document.querySelector("#goto_employees");

const signOut = document.getElementById("signout");

const content_cover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content');
const toolBar_tb = document.querySelector('.toolBar_tb');
const floatCircle = document.querySelector(".floatCircle");










/**ON LOAD */
window.addEventListener("load", ()=>{

    //Alert ipcMain of readiness
    ipcRenderer.send("ready");

    toolBar_tb.focus();
    initializeEmployees();

})

window.addEventListener("keyup", (e)=>{

    if(e.code === "F1"){
        toolBar_tb.focus();
    }

})


controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)

signOut.addEventListener("click", openExitDialogBox)

//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)
goto_Inventory.addEventListener('click',loadInventory)
goto_Analytics.addEventListener('click', loadAnalytics);
goto_Employees.addEventListener('click', loadEmployees)

//For Content
content_cover.addEventListener("click", removeModal)

// toolBar_btn.addEventListener("click", seekItem)
if(toolBar_tb !== null){

    toolBar_tb.addEventListener("keyup", seekItem)
    toolBar_tb.addEventListener("focus", ()=>{
        toolBar_tb.value = "";
    })


}


window.addEventListener('click', (e)=>{
    modifySectionTime(e)
    updateUserLastSeen()
});
window.addEventListener('mouseover', (e)=>{
    modifySectionTime(e)
    updateUserLastSeen()
});
window.addEventListener('keypress', (e)=>{
    modifySectionTime(e)
    updateUserLastSeen();
});

floatCircle.addEventListener("click", openNewUserForm)



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
    ipcRenderer.send('loadStore', [UserName, UserType])
}

function loadInventory(){
    ipcRenderer.send('loadInventory', [UserName, UserType])
}

function loadAnalytics(){
    ipcRenderer.send('loadAnalytics', [UserName, UserType])
}

function loadEmployees(){

    console.log("...loading employees");

    ipcRenderer.send('loadEmployees')

}

function loadLoginPage(){
    ipcRenderer.send('loadLogin')
}

function openExitDialogBox(){

    Modal.openExitPrompt()
    .then(()=>{

        ipcRenderer.send("loadLogin");

    })


}

//Removes Modal
function removeModal(){
    if(mainBodyContent.querySelector('.modal') !== null){
        mainBodyContent.querySelector('.modal').remove();
        document.querySelector('.contentCover').classList.remove('contentCover--shown')
    }
}

function seekItem(){

    const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

    let filtered = toolBar_tb.value.replace(" ", "");

    if(toolBar_tb.value === "" || filtered === ""){

        tableROWS.forEach((row)=>{

            row.style.display = "flex";

        })

        return;

    }

    if(searchtimeOutValue !== 0){

        clearTimeout(searchtimeOutValue)

    }

    searchtimeOutValue = setTimeout(()=>{

        let itemName = toolBar_tb.value;

        if(itemName === "" || itemName === " " || !(itemName.length > 1)){
            return;
        }

        itemName = itemName.toLowerCase();


        tableROWS.forEach((row)=>{

            let initBGcolor = row.style.backgroundColor;
            let initColor = row.style.color;

            let currentItem =   row.querySelector(".td_Names").innerText.toLowerCase();

            if(currentItem.includes(itemName)){

                row.scrollIntoView({behavior: 'smooth'})
                row.focus()

                setTimeout(()=>{
                    row.style.backgroundColor = initBGcolor;
                    row.style.color = initColor;
                },2000)

                clearTimeout(timeOutValue)
            
            }

        })

    } ,2000)
  


}

function startTimeOutCounter(){

    if(timeOutValue !== null || timeOutValue !== undefined){
            clearTimeout(timeOutValue)
    }


     timeOutValue = setTimeout(loadLoginPage, logOutTimeOut)

}



function modifySectionTime(e){

    
    e.stopPropagation();

    clearTimeout(timeOutValue)

    timeOutValue = setTimeout(loadLoginPage, logOutTimeOut)

}

function updateUserLastSeen(){

     //Setting updating user's last seen  
     const now = new Date();
     const lastSeen = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
 
 
     database.setUserLastSeen(UserName, lastSeen);

}

function initializeEmployees(){

    database.getUsers()
    .then((users)=>{

        users.forEach((user)=>{

            if(parseInt(user.IsAdmin) === 1){
                user.IsAdmin = "Administrator";
            }
            else{
                user.IsAdmin = "Regular";
            }

            if(user.Total_Sales === null){
                user.Total_Sales = "0.00";
            }
            if(user.Total_Profits === null)
            {
                user.Total_Profits = "0.00"
            }

            user.Last_Seen = getRelativeTime(user.Last_Seen);

            DOMCONTROLLER.createEmployeeItem(`${user.First_Name} ${user.Last_Name}`, user.IsAdmin, user.Last_Seen, user.Total_Sales, user.Total_Profits);

        })

    })

}

function getRelativeTime(time){

    if(time === null || time===undefined){
        return "Never"
    }

    let [hours, minutes, seconds] = time.split(":");

    [hours, minutes, seconds] = [parseInt(hours), parseInt(minutes), parseInt(seconds)]


    if(hours == 0 && minutes > 60){

        let hours = parseInt(minutes);

        if(hours === 1){

            return `An hour ago`

        }

        return `${hours} hours ago ${minutes} minutes ago`


    }
    else if(hours > 24){
        let days = parseInt(hours/24);
        
        if(days === 1){
            return `${days} day ago`
        }

        return `${days} days ago`

    }
    else if(hours > 168){

        let week = parseInt(hours/168);

        if(week === 1){
            return `${week} week ago`
        }

        return `${week} weeks ago`

    }
    else if(hours > 8760){
        
        let yearMonth = parseFloat(hours/8760).toPrecision(2);

        let [year, month] = yearMonth.split(".");

        if(year === 1){
            
            if(month === 1){
                return `A year and a month ago`
            }
            else{
                return `A year and ${month} months ago`
            }

        }
        else{

            if(month === 1){
                return `${year} years and 1 month ago`
            }
            else{
                return `${year} years and ${month} months ago`
            }

        }

    }
    else{

        if(!(minutes > 1) && hours === 0){


            return "Online"

        }
        else if(hours === 1){

            if(minutes === 1){

                return `An hour and a minute ago`

            }
            else{
                return `${hours} hour ${minutes} minutes ago`
            }


        }
        else{
            return `${hours} hours ${minutes} minutes ago`
        }



    }

}

function openNewUserForm(){

    Modal.openUserForm(true);

}




/*****************************EVENT LISTENERS FOR MAIN PROCESS */
ipcRenderer.on("loadUserInfo", (e, array)=>{
    [UserName, UserType] = array;


    if(UserType === 'Admin'){

        const store = new STORE({
            configName: 'userPrefs',
            defaults: {
                toolTipsPref: 'show',
                timeOutPref: '1',
            }
        });

        let timeOutPref;

        store.get("timeOutPref")
        .then((TimeOutPref)=>{
            
            timeOutPref = parseInt(TimeOutPref)

            logOutTimeOut = 60000 * timeOutPref;

            startTimeOutCounter();


        })
        

        
    }
})

ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [UserName, UserType] = paramsArray;

})

ipcRenderer.on("setUserParams", (e, userParamsArray)=>{


    [UserName, UserType] = userParamsArray

    let windowTitile = document.querySelector(".titleBar_userName");
    windowTitile.innerText = UserName

    //Setting updating user's last seen  
    const now = new Date();
    const lastSeen = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`


    database.setUserLastSeen(UserName, lastSeen)
    .then((result)=>{
        console.log(result);
    })

})