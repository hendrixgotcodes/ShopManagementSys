"use strict";

const { ipcRenderer } = require("electron");
import STORE from '../model/STORE';


//Program Variables
let userName;
let userType;
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

const content_cover = document.querySelector('.contentCover')
const mainBodyContent = document.querySelector('.mainBody_content')
const toolBar_tb = document.querySelector('.toolBar_tb');








ipcRenderer.on("loadUserInfo", (e, array)=>{
    [userName, userType] = array;


    if(userType === 'Admin'){

        const store = new STORE({
            configName: 'userPrefs',
            defaults: {
                toolTipsPref: 'show',
                timeOutPref: '1',
            }
        });

        let timeOutPref;

        store.get("timeOutPref")
        .then((userPref)=>{
            
            timeOutPref = parseInt(userPref)

            console.log(timeOutPref);

            logOutTimeOut = 60000 * timeOutPref;

            startTimeOutCounter();

            let date = new Date();

            console.log("implemented ", date.getSeconds(), date.getMilliseconds());


        })
        

        
    }
})

ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [userName, userType] = paramsArray;

})

/**ON LOAD */
window.addEventListener("load", ()=>{

    //Alert ipcMain of readiness
    ipcRenderer.send("ready");
})


controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)



//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)
goto_Inventory.addEventListener('click',loadInventory)
goto_Analytics.addEventListener('click', loadAnalytics);

//For Content
content_cover.addEventListener("click", removeModal)

// toolBar_btn.addEventListener("click", seekItem)
if(toolBar_tb !== null){

    toolBar_tb.addEventListener("keyup", seekItem)


}


window.addEventListener('click', (e)=>{
    modifySectionTime(e)
});
window.addEventListener('mouseover', (e)=>{
    modifySectionTime(e)
});
window.addEventListener('keypress', (e)=>{
    modifySectionTime(e)
});



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
    ipcRenderer.send('loadStore', [userName, userType])
}

function loadInventory(){
    ipcRenderer.send('loadInventory', [userName, userType])
}

function loadAnalytics(){
    ipcRenderer.send('loadAnalytics', [userName, userType])
}

function loadLoginPage(){
    ipcRenderer.send('loadLogin')
}

//Removes Modal
function removeModal(){
    if(mainBodyContent.querySelector('.modal') !== null){
        mainBodyContent.querySelector('.modal').remove();
        document.querySelector('.contentCover').classList.remove('contentCover--shown')
    }
}

function seekItem(){


    if(searchtimeOutValue !== 0){

        clearTimeout(searchtimeOutValue)

    }

    searchtimeOutValue = setTimeout(()=>{

        let itemName = toolBar_tb.value;

        if(itemName === "" || itemName === " "){
            return;
        }

        itemName = itemName.toLowerCase();

        





        const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

        tableROWS.forEach((row)=>{

            let initBGcolor = row.style.backgroundColor;
            let initColor = row.style.color;

            const currentItem =   row.querySelector(".td_Names").innerText.toLowerCase();

            if(currentItem.includes(itemName)){

                row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)'
                row.style.color = "#fff"

            
                row.scrollIntoView({behavior: 'smooth'})

                setTimeout(()=>{
                    row.style.backgroundColor = initBGcolor;
                    row.style.color = initColor;
                },5000)
            
            }
        })

    } ,1500)
  


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