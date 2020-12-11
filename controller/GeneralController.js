"use strict";

const { ipcRenderer } = require("electron");
import DATABASE from '../model/DATABASE';
import STORE from '../model/STORE';


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

const content_cover = document.querySelector('.contentCover')
const mainBodyContent = document.querySelector('.mainBody_content')
const toolBar_tb = document.querySelector('.toolBar_tb');








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
        .then((userPref)=>{
            
            timeOutPref = parseInt(userPref)

            console.log(timeOutPref);

            logOutTimeOut = 60000 * timeOutPref;

            startTimeOutCounter();

            let date = new Date();


        })
        

        
    }
})

ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [UserName, UserType] = paramsArray;

})

/**ON LOAD */
window.addEventListener("load", ()=>{

    //Alert ipcMain of readiness
    ipcRenderer.send("ready");

    toolBar_tb.focus();
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

function updateUserLastSeen(){

     //Setting updating user's last seen  
     const now = new Date();
     const lastSeen = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
 
 
     database.setUserLastSeen(UserName, lastSeen);

}

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