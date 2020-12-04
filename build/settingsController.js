/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./controller/modals/settingsController.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controller/modals/settingsController.js":
/*!*************************************************!*\
  !*** ./controller/modals/settingsController.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
  ipcRenderer
} = __webpack_require__(/*! electron */ "electron");

const STORE = __webpack_require__(/*! ../../model/STORE */ "./model/STORE.js");

const store = new STORE({
  configName: 'userPrefs',
  defaults: {
    toolTipsPref: 'show',
    timeOutPref: '1'
  }
});
const settings = document.querySelector('#settings');
const contentCover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content'); // import tippy from 'tippy.js';

function openSettings() {
  const settingsModalTemplate = `
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
   
`;
  const settingsModal = document.createElement('div');
  settingsModal.className = "settingsModal";
  settingsModal.setAttribute("aria-placeholder", "Settings Modal");
  settingsModal.innerHTML = settingsModalTemplate;
  const mainBodyContent = document.querySelector('.mainBody_content');
  mainBodyContent.appendChild(settingsModal);
  /***********************************DOM ELEMENTS**************************************** */

  const modalMenu_adminSettings = document.querySelector('.modalMenu_adminSettings');
  const modalMenu_accSettings = document.querySelector('.modalMenu_accSettings');
  const modalMenu_genSettings = document.querySelector('.modalMenu_genSettings');
  const modal_slider = document.querySelector('.slider');
  const toolTipPref = settingsModal.querySelector('.genSettings').querySelector('#toolTipPref');
  const timeOutPref = settingsModal.querySelector('.genSettings').querySelector('#timeOutPref');
  const btnGenSettings = settingsModal.querySelector('.genSettings').querySelector('#btn_genSettings');
  const modal_btn_add = settingsModal.querySelector(".modal_btn_add");
  modal_btn_add.addEventListener("click", openEmployeeForm);
  /***********************************DEFAULT SETTERS**************************************** */

  store.get("toolTipsPref").then(userPref => {
    userPref = toolTipPref;

    if (userPref === "show") {
      toolTipPref.selectedIndex = "0";
    } else if (userPref === "hide") {
      toolTipPref.selectedIndex = "1";
    }
  });
  store.get("timeOutPref").then(userPref => {
    userPref = parseInt(userPref);
    console.log(userPref, "lk");

    switch (userPref) {
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
  });
  /***********************************FUNCTIONS**************************************** */
  //Notification/Alert

  function alertSaved(settingType, action) {
    return new Promise((resolve, reject) => {
      let settingContainer = settingsModal.querySelector(`.${settingType}`);
      let message = `${action} setting saved successfully`;

      if (action === "Tooltips") {
        message = `${action} setting saved successfully. Effect will take place on next start up.`;
      }

      let alertTemplate = `   <center></center>.
            `;
      const alert = document.createElement('div');
      alert.className = "settingsAlert settingsAlert--success";
      alert.innerHTML = alertTemplate;
      settingContainer.appendChild(alert);
      (function showAlert() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            alert.classList.add('settingsAlert--shown');
          }, 100);
          setTimeout(() => {
            alert.classList.remove('settingsAlert--shown');
          }, 3000);
          resolve();
        });
      })().then(() => {
        setTimeout(() => {
          alert.remove();
          resolve();
        }, 3000);
      });
    });
  }

  function alertUnsaved(settingType, action) {
    let settingContainer = settingsModal.querySelector(`.${settingType}`);
    let alertTemplate = `   <center>${action} setting failed to save.
    `;
    const alert = document.createElement('div');
    alert.className = "settingsAlert settingsAlert--fail";
    alert.innerHTML = alertTemplate;
    settingContainer.appendChild(alert);
    (function showAlert() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          alert.classList.add('settingsAlert--shown');
        }, 100);
        setTimeout(() => {
          alert.classList.remove('settingsAlert--shown');
        }, 3000);
      });
    })().then(() => {
      //remove alert banner after 
      setTimeout(() => {
        alert.remove();
      }, 300);
    });
  }

  function setSliderClass(className) {
    modal_slider.classList = null;
    modal_slider.classList.add('slider');
    modal_slider.classList.add(className);
  } //Executed when btn_genSettings (Button in General Settings) is clicked


  function saveGenSettings() {
    // showSettingSaved();
    let toolTipsPref = toolTipPref.value;
    let timeOut = parseInt(timeOutPref.value);
    store.set("toolTipsPref", toolTipsPref).then(() => {
      ipcRenderer.send("ready");
      let date = new Date();
      console.log("alerted ", date.getSeconds(), date.getMilliseconds());
      alertSaved("genSettings", "ToolTips").then(() => {
        store.set("timeOutPref", timeOut).then(() => {
          alertSaved("genSettings", "TimeOut");
        }).catch(error => {
          alertUnsaved("genSettings", "TimeOut");
          console.log(error);
        });
      });
    }).catch(() => {
      alertUnsaved("genSettings", "ToolTips");
    });
  }
  /***********************************EVENT LISTENERS**************************************** */


  btnGenSettings.addEventListener("click", saveGenSettings);
  modalMenu_adminSettings.addEventListener('click', () => {
    setSliderClass('slider--onAdmin');
    modalMenu_adminSettings.classList.add('currentPage');

    if (modalMenu_genSettings.classList.contains("currentPage")) {
      modalMenu_genSettings.classList.remove('currentPage');
    }

    if (modalMenu_accSettings.classList.contains("currentPage")) {
      modalMenu_accSettings.classList.remove('currentPage');
    }
  });
  modalMenu_accSettings.addEventListener('click', () => {
    setSliderClass('slider--onAcc');
    modalMenu_accSettings.classList.add('currentPage');

    if (modalMenu_genSettings.classList.contains("currentPage")) {
      modalMenu_genSettings.classList.remove('currentPage');
    }

    if (modalMenu_adminSettings.classList.contains("currentPage")) {
      modalMenu_adminSettings.classList.remove('currentPage');
    }
  });
  modalMenu_genSettings.addEventListener('click', () => {
    setSliderClass('slider--onGen');
    modalMenu_genSettings.classList.add('currentPage');

    if (modalMenu_adminSettings.classList.contains("currentPage")) {
      modalMenu_adminSettings.classList.remove('currentPage');
    }

    if (modalMenu_accSettings.classList.contains("currentPage")) {
      modalMenu_accSettings.classList.remove('currentPage');
    }
  });
} //For "settings"


settings.addEventListener("click", e => {
  contentCover.classList.toggle('contentCover--shown');
  openSettings();
}); //For "contentCover" To Close Modal Settings

contentCover.addEventListener('click', () => {
  removeSettingsModal(contentCover);
});
mainBodyContent.addEventListener('click', e => {
  if (!(e.target.classList.contains('footer_tb') || e.target.classList.contains('footer_btn'))) {}
});

function removeSettingsModal(cover) {
  if (mainBodyContent.querySelector('.settingsModal') !== null) {
    mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
  }

  cover.classList.toggle('contentCover--shown');
}

function openEmployeeForm() {
  const adminSettings = document.querySelector(".adminSettings");
  const addEmployeePage = document.createElement("div");
  addEmployeePage.className = "addEmployeePage";
  addEmployeePage.innerHTML = `
        <header class="header">New Employee</header>

        <form class="newEmployeeForm">



        </form>
        

    `;
  console.log(adminSettings);
  adminSettings.appendChild(addEmployeePage);
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

/***/ }),

/***/ "./model/STORE.js":
/*!************************!*\
  !*** ./model/STORE.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const electron = __webpack_require__(/*! electron */ "electron");

const path = __webpack_require__(/*! path */ "path");

const fs = __webpack_require__(/*! fs */ "fs");

const {
  promisify
} = __webpack_require__(/*! util */ "util");

class STORE {
  constructor(data) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, data.configName + '.json');
    this.data = parseDataFile(this.path, data.defaults);
  }

  get(key) {
    return new Promise((resolve, reject) => {
      resolve(this.data[key]);
    });
  }

  set(key, val) {
    return new Promise((resolve, reject) => {
      this.data[key] = val; //  const writeFileSync = promisify(fs.writeFileSync);

      fs.writeFileSync(this.path, JSON.stringify(this.data));
      const writeFile = promisify(fs.writeFile);
      writeFile(this.path, JSON.stringify(this.data)).then(() => {
        let date = new Date();
        resolve();
      });
    });
  }

}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.log(error);
    return defaults;
  }
}

module.exports = STORE;

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=settingsController.js.map