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
                                <select class="modal_ddMenu">
                                    <option value="show">Show Tooltips</option>
                                    <option value="hide">Hide Tooltips</option>
                                </select>
                            </label>
                            <button class="modal_btn_submit">Change</button>

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


mainBodyContent.appendChild(settingsModal);



/*****************************METHODS******************* */
// tippy('#settings',{
//     content: settingsModal,
//     trigger: "click",
//     hideOnClick: true,
//     offset: [300, 250],
//     interactive: true,
//     arrow: false,
//     theme: 'white',
// })


const modalMenu_adminSettings = document.querySelector('.modalMenu_adminSettings');
const modalMenu_accSettings = document.querySelector('.modalMenu_accSettings');
const modalMenu_genSettings = document.querySelector('.modalMenu_genSettings');
const modal_slider = document.querySelector('.slider');

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

function setSliderClass(className){
    modal_slider.classList = null;
    modal_slider.classList.add('slider')
    modal_slider.classList.add(className)
}

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