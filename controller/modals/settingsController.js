"use strict";

const { ipcRenderer } = require("electron");
const DATABASE = require("../../model/DATABASE");
const STORE = require("../../model/STORE");
const cryptoJS = require("crypto-js");
const timeDiff = require("timediff");
const ACCOUNTREPORTER = require("../../model/ACCOUNTREPORTER");

const database = new DATABASE();

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
                                        <th class="tableHead_items">User Name</th>
                                        <th class="tableHead_items">Admin Status</th>
                                        <th class="tableHead_items">Last Seen</th>
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
const modal_tBody = settingsModal.querySelector(".settingsContainer").querySelector(".modal_tBody");

const toolTipPref = settingsModal.querySelector('.genSettings').querySelector('#toolTipPref');
const timeOutPref = settingsModal.querySelector('.genSettings').querySelector('#timeOutPref');
const btnGenSettings = settingsModal.querySelector('.genSettings').querySelector('#btn_genSettings');

const modal_btn_add = settingsModal.querySelector(".modal_btn_add");


/***********Event Listeners */
modal_btn_add.addEventListener("click", openEmployeeForm)


/***********************************DEFAULT SETTERS**************************************** */
initializeEmployeeTable()

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
function initializeEmployeeTable(){

    database.getUsers()
    .then((users)=>{


        users.forEach((user)=>{

            let userStatus = "Regular"

            console.log(user.Last_Seen);

            if(user.IsAdmin === 1){
                userStatus = "Admin"
            }

            const tableContentTemplate = 
            `
                <td>${user.First_Name} ${user.Last_Name}</td>
                <td>${user.User_Name}</td>
                <td>${userStatus}</td>
                <td>${getRelativeTime(user.Last_Seen)}</td>
            `

            const tableRow = document.createElement("tr");
            tableRow.className = "bodyRow";
            tableRow.innerHTML = tableContentTemplate;

            modal_tBody.appendChild(tableRow);
            

        })

    })

    function getRelativeTime(time){

        if(time === null || time===undefined){
            return "Not available"
        }

        let finalTime;
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

}

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

function openEmployeeForm(){

    const adminSettings = document.querySelector(".adminSettings");

    const addEmployeePage = document.createElement("div");
    addEmployeePage.className = "addEmployeePage";

    addEmployeePage.innerHTML = 
    `
        <header class="header">New Employee</header>

        <div class="alertBanner">Content Here</div>

        <form class="newEmployeeForm">

            <label for="tb_firstName" class="form_lbl" id="lbl_firstName">

                First Name:

                <input type="text" name="tb_firstName" id="tb_firstName" class="form_tb">

            </label>

            <label for="tb_secondName" class="form_lbl" id="lbl_secondName">

                Second Name:
                <input type="text" name="tb_secondName" id="tb_secondName" class="form_tb" >

            </label>

            <label for="tb_userName" class="form_lbl" id="lbl_userName">

                User Name:
                <input type="text" name="tb_userName" id="tb_userName" class="form_tb" >

            </label>

            <label for="tb_newPassword" class="form_lbl" id="lbl_newPassword">

                Password:
                <input type="password" name="tb_newPassword" id="tb_newPassword" class="form_tb" >

            </label>

            <label for="tb_confirmPassword" class="form_lbl" id="lbl_confirmPassword">

                Confirm Password:
                <input type="password" name="tb_confirmPassword" id="tb_confirmPassword" class="form_tb" >

            </label>

            <label for="tb_empStatus" class="form_lbl" id="lbl_empStatus">

                Account Type:
                <select id="tb_empStatus" name="tb_empStatus">

                    <option value="0">Regular</option>
                    <option value="1">Administrator</option>

                </select>

            </label>

        </form>

        <button id="btn_employ">Employ</button>

        <div class="lostAccountsCount lostAccountsCount---shown">0</div>
        

    `
    adminSettings.appendChild(addEmployeePage)

    const formTBs = addEmployeePage.querySelectorAll(".form_tb");
    const btnEmploy = addEmployeePage.querySelector("#btn_employ")
    const alertBanner = addEmployeePage.querySelector(".alertBanner")

    //Textbox
    const firstName = addEmployeePage.querySelector("#tb_firstName");
    const secondName = addEmployeePage.querySelector("#tb_secondName")
    const userName = addEmployeePage.querySelector("#tb_userName")
    const newPassword = addEmployeePage.querySelector("#tb_newPassword")
    const confirmPassword = addEmployeePage.querySelector("#tb_confirmPassword")
    const accountType = addEmployeePage.querySelector("#tb_empStatus")
    

    /************EVENT LISTENERS */
    formTBs.forEach((textbox)=>{

        textbox.addEventListener("blur", ()=>{

            if(textbox.value === ""){
                textbox.classList.add("emptyTB")
                textbox.setAttribute("placeholder", "*empty field")
            }
            else{
                textbox.classList.remove("emptyTB")
                textbox.setAttribute("placeholder", "")
            }

        })

    })

    btnEmploy.addEventListener("click", ()=>{

        let emptyField = false;

        formTBs.forEach((textbox)=>{

            if(textbox.value === ""){

                alertBanner.innerText = "One or more field is empty"
                alertBanner.classList.add("alertError");

                emptyField = true;

                setTimeout(()=>{
                    alertBanner.classList.remove("alertError")
                }, 3000)

                return;

            }

        })

        if(emptyField === false){

            if(newPassword.value === confirmPassword.value){


                    generateHash(userName.value, confirmPassword.value)
                    .then((hash)=>{

                        let newUser = {
                            First_Name: firstName.value,
                            Last_Name: secondName.value,
                            User_Name: userName.value,
                            Password: hash,
                            IsAdmin: accountType.value
                        }

                        formTBs.forEach((textbox)=>{

                            textbox.value = "";
        
                        })

                        database.addNewUser(newUser)
                        .then(()=>{

                            alertBanner.innerText = "User added successfully"
                            alertBanner.classList.add("alertSuccess");

                            setTimeout(()=>{
                                alertBanner.classList.remove("alertSuccess")
                            }, 3000)

                        })
                        .catch(()=>{

                            alertBanner.innerText = "Failed to add user. An error occured"
                            alertBanner.classList.add("alertError");

                            setTimeout(()=>{
                                alertBanner.classList.remove("alertError")
                            }, 3000)

                        })

                    })
                    

                }
                else{

                    alertBanner.innerText = "The two provided passwords do not match"
                    alertBanner.classList.add("alertError");

                    setTimeout(()=>{
                        alertBanner.classList.remove("alertError")
                    }, 3000)


                }

            }

        

    })

    //Functions
    function generateHash(userName, password){

        return new Promise((resolve, reject)=>{

            const hash = cryptoJS.AES.encrypt(password, userName).toString()

            resolve(hash)

        })


    }

    //checking for lost accounts
    const accountReporter = new ACCOUNTREPORTER();

    setTimeout(()=>{

        accountReporter.get()
        .then((lostAccounts)=>{

            if(lostAccounts.length > 0)
            {
                let word = "report";

                if(lostAccounts.length > 1){
                    word = "reports"
                }

                alertBanner.innerText = `${lostAccounts.length} users have lost have lost their passwords. Click to resolve them now?`
                alertBanner.classList.add("alertInfo");

                setTimeout(()=>{
                    alertBanner.classList.remove("alertInfo")
                }, 10000)
            }

        })

    }, 2000)

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
