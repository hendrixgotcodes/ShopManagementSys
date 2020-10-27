"use strict";

const STORE = require("../../model/STORE");

const store = new STORE({
    configName: 'userPrefs',
    defaults: {
        toolTipsPref: 'show',
        timeOutPref: '1',
    }
});


// import tippy from 'tippy.js';
function openSettings(){

const settingsModalTemplate =
    `
    <div class="settingsContainer" aria-placeholder="Container">

            <div class="account modalPage" aria-placeholder="Account Settings">
                <div class="modal_menu">
                    <div class="modalMenu_adminSettings modalMenu_item currentPage">
                        <img src="../Icons/settings/employees.svg" />
                    </div>

                    <div class="modalMenu_accSettings modalMenu_item">
                        <img src="../Icons/menuIcons/Tray/account.svg" />
                    </div>

                    <div class="modalMenu_genSettings modalMenu_item">
                        <img src="../Icons/settings/settings.svg" />
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
toolTipPref.selectedIndex = parseInt(store.get("toolTipsPref"))
timeOutPref.selectedIndex = parseInt(store.get("timeOutPref"))




/***********************************FUNCTIONS**************************************** */
//Notification/Alert
function alertSaved(settingType, action){

        return new Promise((resolve, reject)=>{

            let settingContainer =  settingsModal.querySelector(`.${settingType}`);

            let alertTemplate = 
            `   <center>${action} setting saved successfully.
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

        setTimeout(()=>{
            alert.remove();
        }, 3000);

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
    let timeOut = timeOutPref.value

    store.set("toolTipsPref", toolTipsPref)
    .then(()=>{
        alertSaved("genSettings","ToolTips")
        .then(()=>{

            store.set("timeOutPref", timeOut)
            .then(()=>{
                alertSaved("genSettings","TimeOut")
            })
            .catch(()=>{
                alertUnsaved("genSettings","TimeOut")
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