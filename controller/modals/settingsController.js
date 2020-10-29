"use strict";

const { ipcRenderer } = require("electron");
const DATA = require("../../model/DATA");
const STORE = require("../../model/STORE");

const store = new STORE({
    configName: 'userPrefs',
    defaults: {
        toolTipsPref: 'show',
        timeOutPref: '1',
    }
});

const settings = document.querySelector('#settings');
const contentCover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content');


// import tippy from 'tippy.js';
function openSettings(){

const settingsModalTemplate =
    `
    <div class="settingsContainer" aria-placeholder="Container">

            <div class="account modalPage" aria-placeholder="Account Settings">
                <div class="modal_menu">
                    <div class="modalMenu_adminSettings modalMenu_item currentPage">
                        <img src="../Icons/settings/employees.svg" />
                        <div>My Employees</div>
                    </div>

                    <div class="modalMenu_accSettings modalMenu_item">
                        <img src="../Icons/menuIcons/Tray/account.svg" />
                        <div>My Account</div>
                    </div>

                    <div class="modalMenu_genSettings modalMenu_item">
                        <img src="../Icons/settings/settings.svg" />
                        <div>General Settings</div>
                    </div>

                </div>

                <div class="modal_content">

                    <header class="modalHeader">
                        <h1 class="modalTitle"> <img src="../Icons/settings/adminSettings.png" />
                            Admin Settings
                        </h1>
                    </header>
                    <div class="modalContent_body slider slider--onAdmin">
                        <div class="modalContent_settings adminSettings">

                            <table class="contentTable modal_table">
                                <thead class="tableHeader">
                                    <tr class="modal_tHead">
                                        <th class="tableHead_items">Name</th>
                                        <th class="tableHead_items">DOB</th>
                                        <th class="tableHead_items">Date Registered</th>
                                    </tr>
                                </thead>
                                <tbody class="modal_tBody">


                                </tbody>
                            </table>

                            <div class="modal_btn_add" aria-placeholder="Add User">
                                <img src="../Icons/settings/addUser.svg" />
                            </div>

                        </div>
                        <div class="modalContent_settings accSettings">
                            <center>
                                <label class="settingsLabel">
                                    UserName
                                    <input type="text" placeholder="Leave blank to maintain current name"
                                        class="modal_textB">
                                </label>
                                <label class="settingsLabel">
                                    New Password
                                    <input type="password" placeholder="New Password" class="New Password">
                                </label>
                                <label class="settingsLabel">
                                    Confirm Pasword
                                    <input type="password" placeholder="Confirm Password" class="Confirm New Password">
                                </label>
                                <label class="settingsLabel">
                                    Current Password
                                    <input type="password" placeholder="Current Password" class="Old Password Password">
                                </label>
                            </center>
                            <button class="modal_btn_submit">Change</button>
                        </div>
                        <div class="modalContent_settings genSettings">

                            <label class="settingsLabel">
                                ToolTips Options
                                <select id="toolTipPref" class="modal_ddMenu">
                                    <option value="show">Show Tooltips</option>
                                    <option value="hide">Hide Tooltips</option>
                                </select>
                            </label>
                            <label class="settingsLabel">
                                Timeout After Inactivity
                                <select id="timeOutPref" class="modal_ddMenu">
                                    <option value="1">One Minute</option>
                                    <option value="3">Three Minutes</option>
                                    <option value="5">Five Minutes</option>
                                    <option value="10">Ten Minutes</option>
                                    <option value="15">15 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                </select>
                            </label>
                            <button id="btn_genSettings" class="modal_btn_submit">Change</button>

                        </div>
                    </div>

                </div>

            </div>


        </div>
   
`

const settingsModal = document.createElement('div');
settingsModal.className = "settingsModal";
settingsModal.setAttribute("aria-placeholder", "Settings Modal");

settingsModal.innerHTML = settingsModalTemplate;

const mainBodyContent = document.querySelector('.mainBody_content')

mainBodyContent.appendChild(settingsModal);




/***********************************DOM ELEMENTS**************************************** */

const modalMenu_adminSettings = document.querySelector('.modalMenu_adminSettings');
const modalMenu_accSettings = document.querySelector('.modalMenu_accSettings');
const modalMenu_genSettings = document.querySelector('.modalMenu_genSettings');
const modal_slider = document.querySelector('.slider');

const toolTipPref = settingsModal.querySelector('.genSettings').querySelector('#toolTipPref');
const timeOutPref = settingsModal.querySelector('.genSettings').querySelector('#timeOutPref');
const btnGenSettings = settingsModal.querySelector('.genSettings').querySelector('#btn_genSettings');


/***********************************DEFAULT SETTERS**************************************** */
store.get("toolTipsPref")
.then((userPref)=>{

    userPref = toolTipPref;

    if(userPref === "show"){
        toolTipPref.selectedIndex = "0";
    }
    else if(userPref === "hide"){
        toolTipPref.selectedIndex = "1";
    }

})

store.get("timeOutPref")
.then((userPref)=>{

    userPref = parseInt(userPref)

    console.log(userPref, "lk");

    switch(userPref){

        case 1:
            timeOutPref.selectedIndex = "0";
            console.log("0");
            break;
        case 3:
            timeOutPref.selectedIndex = "1";
            break;
        case 5:
            timeOutPref.selectedIndex = "2";
            break;
        case 10:
            timeOutPref.selectedIndex = "3";
            break;
        case 15:
            timeOutPref.selectedIndex = "4";
            break;
        case 30:
            timeOutPref.selectedIndex = "5";
            break;
    
        default:
            timeOutPref.selectedIndex = "0";    
    
    
    }   

})





/***********************************FUNCTIONS**************************************** */
//Notification/Alert
function alertSaved(settingType, action){

        return new Promise((resolve, reject)=>{

            let settingContainer =  settingsModal.querySelector(`.${settingType}`);

            let message = `${action} setting saved successfully`;

            if(action === "Tooltips"){
                message = `${action} setting saved successfully. Effect will take place on next start up.`;
            }

            let alertTemplate = 
            `   <center></center>.
            `
            const alert = document.createElement('div');
            alert.className = "settingsAlert settingsAlert--success";
        
            alert.innerHTML = alertTemplate;
            
            settingContainer.appendChild(alert);
        
        
            (function showAlert(){
                return new Promise((resolve, reject)=>{
        
                    setTimeout(()=>{
                        alert.classList.add('settingsAlert--shown')
                    }, 100);
        
                    setTimeout(()=>{
                        alert.classList.remove('settingsAlert--shown');
                    }, 3000);

                    resolve();
        
                })
            })()
            .then(()=>{
        
                setTimeout(()=>{
                    alert.remove();

                    resolve()
                }, 3000);

                
        
            })


            
        

        })
   

}
function alertUnsaved(settingType, action){

    let settingContainer =  settingsModal.querySelector(`.${settingType}`);

    let alertTemplate = 
    `   <center>${action} setting failed to save.
    `
    const alert = document.createElement('div');
    alert.className = "settingsAlert settingsAlert--fail";

    alert.innerHTML = alertTemplate;
    
    settingContainer.appendChild(alert);


    (function showAlert(){
        return new Promise((resolve, reject)=>{

            setTimeout(()=>{
                alert.classList.add('settingsAlert--shown')
            }, 100);

            setTimeout(()=>{
                alert.classList.remove('settingsAlert--shown');
            }, 3000);

        })
    })()
    .then(()=>{

        //remove alert banner after 
        setTimeout(()=>{
            alert.remove();
        }, 300);

    })
    

}

function setSliderClass(className){
    modal_slider.classList = null;
    modal_slider.classList.add('slider')
    modal_slider.classList.add(className)
}

//Executed when btn_genSettings (Button in General Settings) is clicked
function saveGenSettings(){


    // showSettingSaved();

    let toolTipsPref = toolTipPref.value;
    let timeOut = parseInt(timeOutPref.value)

    store.set("toolTipsPref", toolTipsPref)
    .then(()=>{

        ipcRenderer.send("ready");

        let date = new Date();

        console.log("alerted ", date.getSeconds(), date.getMilliseconds());

        alertSaved("genSettings","ToolTips")
        .then(()=>{

            store.set("timeOutPref", timeOut)
            .then(()=>{
                alertSaved("genSettings","TimeOut")
            })
            .catch((error)=>{
                alertUnsaved("genSettings","TimeOut")

                console.log(error);
            })

        })

        

    })
    .catch(()=>{
        alertUnsaved("genSettings","ToolTips")
    })


    

} 



/***********************************EVENT LISTENERS**************************************** */
btnGenSettings.addEventListener("click", saveGenSettings)

modalMenu_adminSettings.addEventListener('click', ()=>{
    setSliderClass('slider--onAdmin')

    modalMenu_adminSettings.classList.add('currentPage')

    if(modalMenu_genSettings.classList.contains("currentPage")){
        modalMenu_genSettings.classList.remove('currentPage')
    }

    if(modalMenu_accSettings.classList.contains("currentPage")){
        modalMenu_accSettings.classList.remove('currentPage')
    }


});
modalMenu_accSettings.addEventListener('click',()=>{
    setSliderClass('slider--onAcc')

    modalMenu_accSettings.classList.add('currentPage')

    if(modalMenu_genSettings.classList.contains("currentPage")){
        modalMenu_genSettings.classList.remove('currentPage')
    }

    if(modalMenu_adminSettings.classList.contains("currentPage")){
        modalMenu_adminSettings.classList.remove('currentPage')
    }
})
modalMenu_genSettings.addEventListener('click', ()=>{
    setSliderClass('slider--onGen')

    modalMenu_genSettings.classList.add('currentPage')


    if(modalMenu_adminSettings.classList.contains("currentPage")){
        modalMenu_adminSettings.classList.remove('currentPage')
    }

    if(modalMenu_accSettings.classList.contains("currentPage")){
        modalMenu_accSettings.classList.remove('currentPage')
    }
})


}


//For "settings"
settings.addEventListener("click",(e)=>{
    contentCover.classList.toggle('contentCover--shown');
    openSettings();
})

//For "contentCover" To Close Modal Settings
contentCover.addEventListener('click', ()=>{
    removeSettingsModal(contentCover)

});

mainBodyContent.addEventListener('click', (e)=>{
    if(!(e.target.classList.contains('footer_tb') || e.target.classList.contains('footer_btn'))){
          
    }
})

function removeSettingsModal(cover){
    if (mainBodyContent.querySelector('.settingsModal') !== null){
        mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
    }

    cover.classList.toggle('contentCover--shown');
}


/**********************TIPPJS**************** */

// import tippy from 'tippy.js'
// import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
// import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';
// import '../../node_modules/tippy.js/themes/material.css';
// import "../../node_modules/tippy.js/themes/light.css";
// import 'tippy.js/themes/light.css';
// import 'tippy.js/animations/perspective.css'

// //For admin settings tab
// tippy(modalMenu_adminSettings,{
//     content: 'Admin Settings',
//     placement: 'bottom-right',
//     interactive: true,
//     theme: 'tomato',
//     arrow: true
// });

// //For account settings tab
// tippy(modalMenu_accSettings,{
//     content: 'Account Settings',
//     placement: 'bottom-right',
//     interactive: true,
//     theme: 'tomato',
//     arrow: true
// });

// //For general settings tab
// tippy(modalMenu_genSettings,{
//     content: 'General Settings',
//     placement: 'bottom-right',
//     interactive: true,
//     theme: 'tomato',
//     arrow: true
// });

exports = openSettings;