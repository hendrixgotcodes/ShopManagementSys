"use strict";

const { ipcRenderer } = require("electron");
import DATABASE from '../model/DATABASE';
import Modal from "./modals/ModalController";


const database = new DATABASE();


//Program Variables
let UserName;
let UserType;
let isFullScreen = false;
let searchtimeOutValue;




/*****************DOM ELEMENTS*****/
const mainBody = document.querySelector('body');
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');

const goto_Store = document.querySelector('#goto_store')
const signout  = document.getElementById("signout")


const content_cover = document.querySelector('.contentCover')
const mainBodyContent = document.querySelector('.mainBody_content')
const toolBar_tb = document.querySelector('.toolBar_tb');








ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [UserName, UserType] = paramsArray;

})

/**ON LOAD */
window.addEventListener("load", ()=>{

    //Alert ipcMain of readiness
    ipcRenderer.send("ready");

    toolBar_tb.focus();
})

window.addEventListener("keyup", (e)=>{

    if(e.code === "F1"){
        toolBar_tb.focus();
    }

})


controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)



//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)

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
    updateUserLastSeen()
});
window.addEventListener('mouseover', (e)=>{
    updateUserLastSeen()
});
window.addEventListener('keypress', (e)=>{
    updateUserLastSeen();
});

signout.addEventListener("click", openExitDialogBox)



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
    if(document.querySelector(".contentContainer").querySelector(".modal") !== null){

        document.querySelector(".contentContainer").querySelector(".modal").remove();
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

            let currentItem =   row.querySelector(".td_Name--hidden").innerText.toLowerCase();

            if(currentItem.includes(itemName)){

                row.scrollIntoView({behavior: 'smooth'})
                row.focus()

                setTimeout(()=>{
                    row.style.backgroundColor = initBGcolor;
                    row.style.color = initColor;
                },2000)

                clearTimeout(searchtimeOutValue)
            
            }
            else{

                currentItem = row.querySelector(".td_Brand--hidden").innerText.toLowerCase();

                if(currentItem.includes(itemName)){

                    row.scrollIntoView({behavior: 'smooth'})
                    row.focus()
    
    
                    clearTimeout(searchtimeOutValue)
                
                }
                else{

                    currentItem = row.querySelector(".td_Category--hidden").innerText.toLowerCase();

                    if(currentItem.includes(itemName)){

                        row.scrollIntoView({behavior: 'smooth'});
                        row.focus();
        
                        clearTimeout(searchtimeOutValue)
                    
                    }
                    else{

                        row.style.display = "none";

                    }

                }
                
            }
            return;
        })

    } ,2000)
  


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
    

})