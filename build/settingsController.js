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
eval("\n\nconst {\n  ipcRenderer\n} = __webpack_require__(/*! electron */ \"electron\");\n\nconst STORE = __webpack_require__(/*! ../../model/STORE */ \"./model/STORE.js\");\n\nconst store = new STORE({\n  configName: 'userPrefs',\n  defaults: {\n    toolTipsPref: 'show',\n    timeOutPref: '1'\n  }\n});\nconst settings = document.querySelector('#settings');\nconst contentCover = document.querySelector('.contentCover');\nconst mainBodyContent = document.querySelector('.mainBody_content'); // import tippy from 'tippy.js';\n\nfunction openSettings() {\n  const settingsModalTemplate = `\n    <div class=\"settingsContainer\" aria-placeholder=\"Container\">\n\n            <div class=\"account modalPage\" aria-placeholder=\"Account Settings\">\n                <div class=\"modal_menu\">\n                    <div class=\"modalMenu_adminSettings modalMenu_item currentPage\">\n                        <img src=\"../Icons/settings/employees.svg\" />\n                    </div>\n\n                    <div class=\"modalMenu_accSettings modalMenu_item\">\n                        <img src=\"../Icons/menuIcons/Tray/account.svg\" />\n                    </div>\n\n                    <div class=\"modalMenu_genSettings modalMenu_item\">\n                        <img src=\"../Icons/settings/settings.svg\" />\n                    </div>\n\n                </div>\n\n                <div class=\"modal_content\">\n\n                    <header class=\"modalHeader\">\n                        <h1 class=\"modalTitle\"> <img src=\"../Icons/settings/adminSettings.png\" />\n                            Admin Settings\n                        </h1>\n                    </header>\n                    <div class=\"modalContent_body slider slider--onAdmin\">\n                        <div class=\"modalContent_settings adminSettings\">\n\n                            <table class=\"contentTable modal_table\">\n                                <thead class=\"tableHeader\">\n                                    <tr class=\"modal_tHead\">\n                                        <th class=\"tableHead_items\">Name</th>\n                                        <th class=\"tableHead_items\">DOB</th>\n                                        <th class=\"tableHead_items\">Date Registered</th>\n                                    </tr>\n                                </thead>\n                                <tbody class=\"modal_tBody\">\n\n\n                                </tbody>\n                            </table>\n\n                            <div class=\"modal_btn_add\" aria-placeholder=\"Add User\">\n                                <img src=\"../Icons/settings/addUser.svg\" />\n                            </div>\n\n                        </div>\n                        <div class=\"modalContent_settings accSettings\">\n                            <center>\n                                <label class=\"settingsLabel\">\n                                    UserName\n                                    <input type=\"text\" placeholder=\"Leave blank to maintain current name\"\n                                        class=\"modal_textB\">\n                                </label>\n                                <label class=\"settingsLabel\">\n                                    New Password\n                                    <input type=\"password\" placeholder=\"New Password\" class=\"New Password\">\n                                </label>\n                                <label class=\"settingsLabel\">\n                                    Confirm Pasword\n                                    <input type=\"password\" placeholder=\"Confirm Password\" class=\"Confirm New Password\">\n                                </label>\n                                <label class=\"settingsLabel\">\n                                    Current Password\n                                    <input type=\"password\" placeholder=\"Current Password\" class=\"Old Password Password\">\n                                </label>\n                            </center>\n                            <button class=\"modal_btn_submit\">Change</button>\n                        </div>\n                        <div class=\"modalContent_settings genSettings\">\n\n                            <label class=\"settingsLabel\">\n                                ToolTips Options\n                                <select id=\"toolTipPref\" class=\"modal_ddMenu\">\n                                    <option value=\"show\">Show Tooltips</option>\n                                    <option value=\"hide\">Hide Tooltips</option>\n                                </select>\n                            </label>\n                            <label class=\"settingsLabel\">\n                                Timeout After Inactivity\n                                <select id=\"timeOutPref\" class=\"modal_ddMenu\">\n                                    <option value=\"1\">One Minute</option>\n                                    <option value=\"3\">Three Minutes</option>\n                                    <option value=\"5\">Five Minutes</option>\n                                    <option value=\"10\">Ten Minutes</option>\n                                    <option value=\"15\">15 Minutes</option>\n                                    <option value=\"30\">30 Minutes</option>\n                                </select>\n                            </label>\n                            <button id=\"btn_genSettings\" class=\"modal_btn_submit\">Change</button>\n\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n\n\n        </div>\n   \n`;\n  const settingsModal = document.createElement('div');\n  settingsModal.className = \"settingsModal\";\n  settingsModal.setAttribute(\"aria-placeholder\", \"Settings Modal\");\n  settingsModal.innerHTML = settingsModalTemplate;\n  const mainBodyContent = document.querySelector('.mainBody_content');\n  mainBodyContent.appendChild(settingsModal);\n  /***********************************DOM ELEMENTS**************************************** */\n\n  const modalMenu_adminSettings = document.querySelector('.modalMenu_adminSettings');\n  const modalMenu_accSettings = document.querySelector('.modalMenu_accSettings');\n  const modalMenu_genSettings = document.querySelector('.modalMenu_genSettings');\n  const modal_slider = document.querySelector('.slider');\n  const toolTipPref = settingsModal.querySelector('.genSettings').querySelector('#toolTipPref');\n  const timeOutPref = settingsModal.querySelector('.genSettings').querySelector('#timeOutPref');\n  const btnGenSettings = settingsModal.querySelector('.genSettings').querySelector('#btn_genSettings');\n  /***********************************DEFAULT SETTERS**************************************** */\n\n  let userPref1 = store.get(\"toolTipsPref\");\n  let userPref2 = parseInt(store.get(\"timeOutPref\"));\n\n  if (userPref1 === \"show\") {\n    toolTipPref.selectedIndex = \"0\";\n  } else if (userPref1 === \"hide\") {\n    toolTipPref.selectedIndex = \"1\";\n  }\n\n  switch (userPref2) {\n    case 1:\n      timeOutPref.selectedIndex = \"0\";\n      console.log(\"0\");\n      break;\n\n    case 3:\n      timeOutPref.selectedIndex = \"1\";\n      break;\n\n    case 5:\n      timeOutPref.selectedIndex = \"2\";\n      break;\n\n    case 10:\n      timeOutPref.selectedIndex = \"3\";\n      break;\n\n    case 15:\n      timeOutPref.selectedIndex = \"4\";\n      break;\n\n    case 30:\n      timeOutPref.selectedIndex = \"5\";\n      break;\n\n    default:\n      timeOutPref.selectedIndex = \"0\";\n  }\n  /***********************************FUNCTIONS**************************************** */\n  //Notification/Alert\n\n\n  function alertSaved(settingType, action) {\n    return new Promise((resolve, reject) => {\n      let settingContainer = settingsModal.querySelector(`.${settingType}`);\n      let message = `${action} setting saved successfully`;\n\n      if (action === \"Tooltips\") {\n        message = `${action} setting saved successfully. Effect will take place on next start up.`;\n      }\n\n      let alertTemplate = `   <center></center>.\n            `;\n      const alert = document.createElement('div');\n      alert.className = \"settingsAlert settingsAlert--success\";\n      alert.innerHTML = alertTemplate;\n      settingContainer.appendChild(alert);\n      (function showAlert() {\n        return new Promise((resolve, reject) => {\n          setTimeout(() => {\n            alert.classList.add('settingsAlert--shown');\n          }, 100);\n          setTimeout(() => {\n            alert.classList.remove('settingsAlert--shown');\n          }, 3000);\n          resolve();\n        });\n      })().then(() => {\n        setTimeout(() => {\n          alert.remove();\n          resolve();\n        }, 3000);\n      });\n    });\n  }\n\n  function alertUnsaved(settingType, action) {\n    let settingContainer = settingsModal.querySelector(`.${settingType}`);\n    let alertTemplate = `   <center>${action} setting failed to save.\n    `;\n    const alert = document.createElement('div');\n    alert.className = \"settingsAlert settingsAlert--fail\";\n    alert.innerHTML = alertTemplate;\n    settingContainer.appendChild(alert);\n    (function showAlert() {\n      return new Promise((resolve, reject) => {\n        setTimeout(() => {\n          alert.classList.add('settingsAlert--shown');\n        }, 100);\n        setTimeout(() => {\n          alert.classList.remove('settingsAlert--shown');\n        }, 3000);\n      });\n    })().then(() => {\n      setTimeout(() => {\n        alert.remove();\n      }, 3000);\n    });\n  }\n\n  function setSliderClass(className) {\n    modal_slider.classList = null;\n    modal_slider.classList.add('slider');\n    modal_slider.classList.add(className);\n  } //Executed when btn_genSettings (Button in General Settings) is clicked\n\n\n  function saveGenSettings() {\n    // showSettingSaved();\n    let toolTipsPref = toolTipPref.value;\n    let timeOut = timeOutPref.value;\n    store.set(\"toolTipsPref\", toolTipsPref).then(() => {\n      ipcRenderer.send(\"ready\");\n      alertSaved(\"genSettings\", \"ToolTips\").then(() => {\n        store.set(\"timeOutPref\", timeOut).then(() => {\n          alertSaved(\"genSettings\", \"TimeOut\");\n        }).catch(error => {\n          alertUnsaved(\"genSettings\", \"TimeOut\");\n          console.log(error);\n        });\n      });\n    }).catch(() => {\n      alertUnsaved(\"genSettings\", \"ToolTips\");\n    });\n  }\n  /***********************************EVENT LISTENERS**************************************** */\n\n\n  btnGenSettings.addEventListener(\"click\", saveGenSettings);\n  modalMenu_adminSettings.addEventListener('click', () => {\n    setSliderClass('slider--onAdmin');\n    modalMenu_adminSettings.classList.add('currentPage');\n\n    if (modalMenu_genSettings.classList.contains(\"currentPage\")) {\n      modalMenu_genSettings.classList.remove('currentPage');\n    }\n\n    if (modalMenu_accSettings.classList.contains(\"currentPage\")) {\n      modalMenu_accSettings.classList.remove('currentPage');\n    }\n  });\n  modalMenu_accSettings.addEventListener('click', () => {\n    setSliderClass('slider--onAcc');\n    modalMenu_accSettings.classList.add('currentPage');\n\n    if (modalMenu_genSettings.classList.contains(\"currentPage\")) {\n      modalMenu_genSettings.classList.remove('currentPage');\n    }\n\n    if (modalMenu_adminSettings.classList.contains(\"currentPage\")) {\n      modalMenu_adminSettings.classList.remove('currentPage');\n    }\n  });\n  modalMenu_genSettings.addEventListener('click', () => {\n    setSliderClass('slider--onGen');\n    modalMenu_genSettings.classList.add('currentPage');\n\n    if (modalMenu_adminSettings.classList.contains(\"currentPage\")) {\n      modalMenu_adminSettings.classList.remove('currentPage');\n    }\n\n    if (modalMenu_accSettings.classList.contains(\"currentPage\")) {\n      modalMenu_accSettings.classList.remove('currentPage');\n    }\n  });\n} //For \"settings\"\n\n\nsettings.addEventListener(\"click\", e => {\n  contentCover.classList.toggle('contentCover--shown');\n  openSettings();\n}); //For \"contentCover\" To Close Modal Settings\n\ncontentCover.addEventListener('click', () => {\n  removeSettingsModal(contentCover);\n});\nmainBodyContent.addEventListener('click', e => {\n  if (!(e.target.classList.contains('footer_tb') || e.target.classList.contains('footer_btn'))) {}\n});\n\nfunction removeSettingsModal(cover) {\n  if (mainBodyContent.querySelector('.settingsModal') !== null) {\n    mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));\n  }\n\n  cover.classList.toggle('contentCover--shown');\n}\n/**********************TIPPJS**************** */\n// import tippy from 'tippy.js'\n// import '../../node_modules/tippy.js/dist/tippy-bundle.umd';\n// import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';\n// import '../../node_modules/tippy.js/themes/material.css';\n// import \"../../node_modules/tippy.js/themes/light.css\";\n// import 'tippy.js/themes/light.css';\n// import 'tippy.js/animations/perspective.css'\n// //For admin settings tab\n// tippy(modalMenu_adminSettings,{\n//     content: 'Admin Settings',\n//     placement: 'bottom-right',\n//     interactive: true,\n//     theme: 'tomato',\n//     arrow: true\n// });\n// //For account settings tab\n// tippy(modalMenu_accSettings,{\n//     content: 'Account Settings',\n//     placement: 'bottom-right',\n//     interactive: true,\n//     theme: 'tomato',\n//     arrow: true\n// });\n// //For general settings tab\n// tippy(modalMenu_genSettings,{\n//     content: 'General Settings',\n//     placement: 'bottom-right',\n//     interactive: true,\n//     theme: 'tomato',\n//     arrow: true\n// });\n\n\nexports = openSettings;\n\n//# sourceURL=webpack:///./controller/modals/settingsController.js?");

/***/ }),

/***/ "./model/STORE.js":
/*!************************!*\
  !*** ./model/STORE.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const electron = __webpack_require__(/*! electron */ \"electron\");\n\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nclass STORE {\n  constructor(data) {\n    const userDataPath = (electron.app || electron.remote.app).getPath('userData');\n    this.path = path.join(userDataPath, data.configName + '.json');\n    this.data = parseDataFile(this.path, data.defaults);\n  }\n\n  get(key) {\n    return this.data[key];\n  }\n\n  set(key, val) {\n    return new Promise((resolve, reject) => {\n      this.data[key] = val;\n\n      try {\n        fs.writeFileSync(this.path, JSON.stringify(this.data));\n        resolve();\n      } catch (error) {\n        this.data[key] = null;\n        reject(error);\n      }\n    });\n  }\n\n}\n\nfunction parseDataFile(filePath, defaults) {\n  try {\n    return JSON.parse(fs.readFileSync(filePath));\n  } catch (error) {\n    console.log(error);\n    return defaults;\n  }\n}\n\nmodule.exports = STORE;\n\n//# sourceURL=webpack:///./model/STORE.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ })

/******/ });