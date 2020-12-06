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
/******/ 	return __webpack_require__(__webpack_require__.s = "./controller/GeneralController.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controller/GeneralController.js":
/*!*****************************************!*\
  !*** ./controller/GeneralController.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _model_STORE__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/STORE */ "./model/STORE.js");
/* harmony import */ var _model_STORE__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_model_STORE__WEBPACK_IMPORTED_MODULE_0__);


const {
  ipcRenderer
} = __webpack_require__(/*! electron */ "electron");

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
const goto_Store = document.querySelector('#goto_store');
const goto_Inventory = document.querySelector('#goto_inventory');
const goto_Analytics = document.querySelector('#goto_analytics');
const content_cover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content');
const toolBar_tb = document.querySelector('.toolBar_tb');
ipcRenderer.on("loadUserInfo", (e, array) => {
  [userName, userType] = array;

  if (userType === 'Admin') {
    const store = new _model_STORE__WEBPACK_IMPORTED_MODULE_0___default.a({
      configName: 'userPrefs',
      defaults: {
        toolTipsPref: 'show',
        timeOutPref: '1'
      }
    });
    let timeOutPref;
    store.get("timeOutPref").then(userPref => {
      timeOutPref = parseInt(userPref);
      console.log(timeOutPref);
      logOutTimeOut = 60000 * timeOutPref;
      startTimeOutCounter();
      let date = new Date();
      console.log("implemented ", date.getSeconds(), date.getMilliseconds());
    });
  }
});
ipcRenderer.on("setUserParams", (e, paramsArray) => {
  [userName, userType] = paramsArray;
});
/**ON LOAD */

window.addEventListener("load", () => {
  //Alert ipcMain of readiness
  ipcRenderer.send("ready");
});
controlBoxMinimize.addEventListener('click', sendMinimizeEvent);
controlBoxMaximize.addEventListener('click', sendMaximizeEvent);
controlBoxClose.addEventListener('click', sendCloseEvent); //For "goto_Inventory"

goto_Store.addEventListener('click', loadStore);
goto_Inventory.addEventListener('click', loadInventory);
goto_Analytics.addEventListener('click', loadAnalytics); //For Content

content_cover.addEventListener("click", removeModal); // toolBar_btn.addEventListener("click", seekItem)

if (toolBar_tb !== null) {
  toolBar_tb.addEventListener("keyup", seekItem);
}

window.addEventListener('click', e => {
  modifySectionTime(e);
});
window.addEventListener('mouseover', e => {
  modifySectionTime(e);
});
window.addEventListener('keypress', e => {
  modifySectionTime(e);
});
/*****************FUNCTIONS*****************/

function sendMinimizeEvent() {
  ipcRenderer.send('minimize');
}

function sendMaximizeEvent() {
  if (isFullScreen === true) {
    ipcRenderer.send("restore");
    restoreMaxi.setAttribute('src', "../Icons/Control_Box/Maximize.png");
    isFullScreen = false;
  } else {
    restoreMaxi.setAttribute('src', "../Icons/Control_Box/Restore.png");
    isFullScreen = true;
    ipcRenderer.send('maximize');
  }
}

function sendCloseEvent() {
  ipcRenderer.send('close');
} //Triggers an event to load the pages in the  ipcMain


function loadStore() {
  ipcRenderer.send('loadStore', [userName, userType]);
}

function loadInventory() {
  ipcRenderer.send('loadInventory', [userName, userType]);
}

function loadAnalytics() {
  ipcRenderer.send('loadAnalytics', [userName, userType]);
}

function loadLoginPage() {
  ipcRenderer.send('loadLogin');
} //Removes Modal


function removeModal() {
  if (mainBodyContent.querySelector('.modal') !== null) {
    mainBodyContent.querySelector('.modal').remove();
    document.querySelector('.contentCover').classList.remove('contentCover--shown');
  }
}

function seekItem() {
  if (searchtimeOutValue !== 0) {
    clearTimeout(searchtimeOutValue);
  }

  searchtimeOutValue = setTimeout(() => {
    let itemName = toolBar_tb.value;

    if (itemName === "" || itemName === " ") {
      return;
    }

    itemName = itemName.toLowerCase();
    const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');
    tableROWS.forEach(row => {
      let initBGcolor = row.style.backgroundColor;
      let initColor = row.style.color;
      const currentItem = row.querySelector(".td_Names").innerText.toLowerCase();

      if (currentItem.includes(itemName)) {
        row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';
        row.style.color = "#fff";
        row.scrollIntoView({
          behavior: 'smooth'
        });
        setTimeout(() => {
          row.style.backgroundColor = initBGcolor;
          row.style.color = initColor;
        }, 5000);
      }
    });
  }, 1500);
}

function startTimeOutCounter() {
  if (timeOutValue !== null || timeOutValue !== undefined) {
    clearTimeout(timeOutValue);
  }

  timeOutValue = setTimeout(loadLoginPage, logOutTimeOut);
}

function modifySectionTime(e) {
  e.stopPropagation();
  clearTimeout(timeOutValue);
  timeOutValue = setTimeout(loadLoginPage, logOutTimeOut);
}

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
//# sourceMappingURL=GeneralController.js.map