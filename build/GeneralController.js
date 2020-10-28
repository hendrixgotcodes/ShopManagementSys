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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _model_STORE__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/STORE */ \"./model/STORE.js\");\n/* harmony import */ var _model_STORE__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_model_STORE__WEBPACK_IMPORTED_MODULE_0__);\n\n\nconst {\n  ipcRenderer\n} = __webpack_require__(/*! electron */ \"electron\");\n\n //Program Variables\n\nlet userName;\nlet userType;\nlet isFullScreen = false;\nlet logOutTimeOut = 30000;\nlet timeOutValue;\nlet searchtimeOutValue;\n/*****************DOM ELEMENTS*****/\n\nconst mainBody = document.querySelector('body');\nconst controlBoxMinimize = document.querySelector('.controlBox_minimize');\nconst controlBoxMaximize = document.querySelector('.controlBox_maximize');\nconst controlBoxClose = document.querySelector('.controlBox_close');\nconst restoreMaxi = document.getElementById('restore_maxi');\nconst goto_Store = document.querySelector('#goto_store');\nconst goto_Inventory = document.querySelector('#goto_inventory');\nconst goto_Analytics = document.querySelector('#goto_analytics');\nconst content_cover = document.querySelector('.contentCover');\nconst mainBodyContent = document.querySelector('.mainBody_content');\nconst toolBar_tb = document.querySelector('.toolBar_tb');\n/****************EVENT LISTENERS ********/\n\nipcRenderer.on(\"loadUserInfo\", (e, array) => {\n  [userName, userType] = array;\n\n  if (userType === 'Admin') {\n    const store = new _model_STORE__WEBPACK_IMPORTED_MODULE_0___default.a({\n      configName: 'userPrefs',\n      defaults: {\n        toolTipsPref: 'show',\n        timeOutPref: '1'\n      }\n    });\n    logOutTimeOut = 60000 * parseInt(store.get(\"timeOutPref\"));\n    startTimeOutCounter();\n  }\n});\n/**ON LOAD */\n\nwindow.addEventListener(\"load\", () => {\n  //Alert ipcMain of readiness\n  ipcRenderer.send(\"ready\");\n});\ncontrolBoxMinimize.addEventListener('click', sendMinimizeEvent);\ncontrolBoxMaximize.addEventListener('click', sendMaximizeEvent);\ncontrolBoxClose.addEventListener('click', sendCloseEvent); //For \"goto_Inventory\"\n\ngoto_Store.addEventListener('click', loadStore);\ngoto_Inventory.addEventListener('click', loadInventory);\ngoto_Analytics.addEventListener('click', loadAnalytics); //For Content\n\ncontent_cover.addEventListener(\"click\", removeModal); // toolBar_btn.addEventListener(\"click\", seekItem)\n\nif (toolBar_tb !== null) {\n  toolBar_tb.addEventListener(\"keyup\", seekItem);\n}\n\nwindow.addEventListener('click', e => {\n  modifySectionTime(e);\n});\nwindow.addEventListener('mouseover', e => {\n  modifySectionTime(e);\n});\nwindow.addEventListener('keypress', e => {\n  modifySectionTime(e);\n});\n/*****************FUNCTIONS*****************/\n\nfunction sendMinimizeEvent() {\n  ipcRenderer.send('minimize');\n}\n\nfunction sendMaximizeEvent() {\n  if (isFullScreen === true) {\n    ipcRenderer.send(\"restore\");\n    restoreMaxi.setAttribute('src', \"../Icons/Control_Box/Maximize.png\");\n    isFullScreen = false;\n  } else {\n    restoreMaxi.setAttribute('src', \"../Icons/Control_Box/Restore.png\");\n    isFullScreen = true;\n    ipcRenderer.send('maximize');\n  }\n}\n\nfunction sendCloseEvent() {\n  ipcRenderer.send('close');\n} //Triggers an event to load the pages in the  ipcMain\n\n\nfunction loadStore() {\n  ipcRenderer.send('loadStore', [userName, userType]);\n}\n\nfunction loadInventory() {\n  ipcRenderer.send('loadInventory', [userName, userType]);\n}\n\nfunction loadAnalytics() {\n  ipcRenderer.send('loadAnalytics', [userName, userType]);\n}\n\nfunction loadLoginPage() {\n  ipcRenderer.send('loadLogin');\n} //Removes Modal\n\n\nfunction removeModal() {\n  if (mainBodyContent.querySelector('.modal') !== null) {\n    mainBodyContent.querySelector('.modal').remove();\n    document.querySelector('.contentCover').classList.remove('contentCover--shown');\n  }\n}\n\nfunction seekItem() {\n  if (searchtimeOutValue !== 0) {\n    clearTimeout(searchtimeOutValue);\n  }\n\n  searchtimeOutValue = setTimeout(() => {\n    let itemName = toolBar_tb.value;\n\n    if (itemName === \"\" || itemName === \" \") {\n      return;\n    }\n\n    itemName = itemName.toLowerCase();\n    const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');\n    tableROWS.forEach(row => {\n      let initBGcolor = row.style.backgroundColor;\n      let initColor = row.style.color;\n      const currentItem = row.querySelector(\".td_Names\").innerText.toLowerCase();\n\n      if (currentItem.includes(itemName)) {\n        row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';\n        row.style.color = \"#fff\";\n        row.scrollIntoView({\n          behavior: 'smooth'\n        });\n        setTimeout(() => {\n          row.style.backgroundColor = initBGcolor;\n          row.style.color = initColor;\n        }, 5000);\n      }\n    });\n  }, 1500);\n}\n\nfunction startTimeOutCounter() {\n  timeOutValue = timeOutValue = setTimeout(loadLoginPage, logOutTimeOut);\n}\n\nfunction modifySectionTime(e) {\n  e.stopPropagation();\n  clearTimeout(timeOutValue);\n  timeOutValue = setTimeout(loadLoginPage, logOutTimeOut);\n}\n\n//# sourceURL=webpack:///./controller/GeneralController.js?");

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