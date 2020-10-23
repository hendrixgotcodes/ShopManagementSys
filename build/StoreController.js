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
/******/ 	return __webpack_require__(__webpack_require__.s = "./controller/StoreController.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./controller/Alerts/NotificationController.js":
/*!*****************************************************!*\
  !*** ./controller/Alerts/NotificationController.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/***********AUDIO FILES*********/\nconst winAlert = new Audio('../../utils/media/syssounds/win10.mp3');\n/**********DOM ELEMENTS*********/\n\nconst notification_banner = document.querySelector('.notification_banner');\n\nclass Notifications {\n  static showNotification(message, boolean) {\n    notification_banner.querySelector('span').innerText = message;\n    notification_banner.style.transform = \"translateX(0%)\";\n\n    if (boolean === true) {\n      notification_banner.querySelector('.banner_arrow').classList.add(\"banner_arrow--show\");\n      console.log(true);\n    }\n\n    winAlert.play();\n    setTimeout(() => {\n      Notifications.hideNotification();\n\n      if (notification_banner.querySelector('.banner_arrow').classList.contains('banner_arrow--show')) {\n        notification_banner.querySelector('.banner_arrow').classList.remove(\"banner_arrow--show\");\n      }\n    }, 5000);\n  }\n\n  static hideNotification() {\n    notification_banner.style.transform = \"translateX(100%)\";\n  }\n\n  static showAlert(errorType, message) {\n    const mainBodyContent = document.querySelector(\".mainBody_content\");\n    errorType = errorType.toLowerCase();\n    let bGColor;\n\n    switch (errorType) {\n      case 'success':\n        bGColor = \"#12A89D\";\n        break;\n\n      case 'warning':\n        bGColor = \"#E17C38\";\n        break;\n\n      case 'error':\n        bGColor = \" #ce2727\";\n        break;\n\n      default:\n        bGColor = \"#12A89D\";\n    }\n\n    let alertTemplate = `\n            <img class=\"img_close\" src=\"../Icons/Modals/closeWhite.svg\" alt=\"Close Modal\" />\n            <div class=\"alertContent\">\n                ${message}\n            </div>\n        `;\n    let alert = document.createElement(\"div\");\n    alert.innerHTML = alertTemplate;\n    alert.className = \"alertBanner\";\n    alert.style.backgroundColor = bGColor;\n    (function Animate() {\n      return new Promise((resolve, reject) => {\n        mainBodyContent.appendChild(alert);\n        resolve();\n      });\n    })().then(() => {\n      setTimeout(() => {\n        mainBodyContent.querySelector(\".alertBanner\").classList.add(\"alertBanner--shown\");\n      }, 300); //Automatically remove after three seconds\n\n      setTimeout(() => {\n        (function Animate() {\n          return new Promise((resolve, reject) => {\n            mainBodyContent.querySelector(\".alertBanner\").classList.remove(\"alertBanner--shown\"); // function will resolve after animation is document (animation takes .5s, function resolves after .6s)\n\n            setTimeout(() => {\n              resolve();\n            }, 600);\n          });\n        })().then(() => {\n          //Removing alertbanner from DOM to increase performance\n          mainBodyContent.querySelector(\".alertBanner\").remove();\n        });\n      }, 5000);\n    });\n  }\n\n}\n\nmodule.exports = Notifications;\n\n//# sourceURL=webpack:///./controller/Alerts/NotificationController.js?");

/***/ }),

/***/ "./controller/StoreController.js":
/*!***************************************!*\
  !*** ./controller/StoreController.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controller/Alerts/NotificationController */ \"./controller/Alerts/NotificationController.js\");\n/* harmony import */ var _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utilities_TableController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities/TableController */ \"./controller/utilities/TableController.js\");\n/* harmony import */ var _utilities_TableController__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utilities_TableController__WEBPACK_IMPORTED_MODULE_1__);\n\n/**\r\n * @param {HTMLTableElement} tableEl\r\n */\n\n/**********************************IMPORTED ***************************/\n\n\n\n/*********************************DOM ELEMENTS********************* */\n// Array of store objects\n\nconst cart = []; //Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount\n\nlet totalSelectedRows = 0;\nlet selectedRows = [];\nlet canSelectRow = true;\nlet footer_tbChanged = false;\n/*********************************DOM ELEMENTS********************* */\n\nconst tip_default = document.querySelector('.tip_default');\nconst selectValue_span = document.querySelector('.selectValue_span');\nconst toolBarTB = document.querySelector('.toolBar_tb');\nconst toolBarBtn = document.querySelector('.toolBar_btn');\nconst settings = document.querySelector('#settings');\nconst contentCover = document.querySelector('.contentCover');\nconst mainBodyContent = document.querySelector('.mainBody_content');\nconst footer_btn = document.querySelector('.footer_btn');\nconst footer_btn_icon = document.querySelector('.ico_footer_btn');\nconst tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');\nconst footer_tb = document.querySelector('.footer_tb');\nconst cartCount = document.querySelector('.cartCount');\n/***********************************OBJECTS**************/\n\nlet sellingItem = {// Represents an instance of a store item being added to cart\n};\n/*********************************EVent Listeners********************* */\n\ntip_default.addEventListener('click', () => {\n  selectValue_span.innerHTML = \"Filter By:\";\n  selectValue_span.setAttribute(\"value\", \"default\");\n  _utilities_TableController__WEBPACK_IMPORTED_MODULE_1___default.a.resetTable();\n}); //For ToolBarBtn\n\ntoolBarBtn.addEventListener('click', e => {\n  e.preventDefault();\n  seek(toolBarTB.value);\n}); //For \"settings\"\n\nsettings.addEventListener(\"click\", e => {\n  contentCover.classList.toggle('contentCover--shown');\n  openSettings();\n}); //For \"contentCover\" To Close Modal Settings\n\ncontentCover.addEventListener('click', () => {\n  removeSettingsModal(contentCover);\n}); //For \"footer_btn\"\n\nfooter_btn.addEventListener('mouseover', toggleTBbtn_white);\nfooter_btn.addEventListener('mouseleave', toggleTBbtn_default);\nfooter_btn.addEventListener(\"click\", e => {\n  e.preventDefault(); //Displays Modal to show selected Items\n\n  showItemsInCart(); // calling function to uncheck checked rows\n\n  uncheckMarkedRows();\n}); //For \"tableBody\"\n\ntableROWS.forEach(row => {\n  row.addEventListener('click', e => {\n    toggleRowCB(row);\n    setSellingItemProperties(row);\n  });\n}); //For \"footer_tb\"\n\nfooter_tb.addEventListener(\"blur\", () => {\n  if (sellingItem.amountPurchased !== undefined && footer_tbChanged !== true) {\n    disableDropDownList();\n    footer_tb.selectedIndex = 0; //Resets Default value of drop down list\n\n    cart.push(sellingItem);\n    sellingItem = {};\n  } else {\n    console.log(sellingItem);\n  }\n});\nfooter_tb.addEventListener(\"change\", () => {\n  cartCount.style.transform = \"scale(1)\";\n  cartCount.innerText = totalSelectedRows;\n  sellingItem.amountPurchased = footer_tb.value;\n  footer_tbChanged = false;\n});\nfooter_tb.addEventListener(\"focus\", () => {\n  footer_tbChanged = true;\n  console.log(footer_tbChanged);\n});\n/*************************************FUNCTIONS********************* */\n\n/*************************************FUNCTIONS********************* */\n\n/*************************************FUNCTIONS********************* */\n\n/*************************************FUNCTIONS********************* */\n\n/*************************************FUNCTIONS********************* */\n//-----------------------------------------------------------------------------------------------\n// Searchs for an element in the Table\n\nfunction seek(variable) {\n  let notFound = true;\n  tableROWS.forEach(row => {\n    if (row.querySelector('.td_Names').innerText.toLowerCase() === variable.toLowerCase()) {\n      row.scrollIntoView({\n        behavior: 'smooth'\n      });\n      const initBGcolor = row.style.backgroundColor;\n      const initColor = row.style.color;\n      row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';\n      row.style.color = \"#fff\";\n      setTimeout(() => {\n        row.style.backgroundColor = initBGcolor;\n        row.style.color = initColor;\n      }, 3000);\n      notFound = false;\n      return;\n    }\n  });\n\n  if (notFound === true) {\n    _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default.a.showNotification(\"Item not found\");\n  }\n} //-----------------------------------------------------------------------------------------------\n//Opens Setting modal\n\n\nfunction removeSettingsModal(cover) {\n  if (mainBodyContent.querySelector('.settingsModal') !== null) {\n    mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));\n  }\n\n  cover.classList.toggle('contentCover--shown');\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction toggleTBbtn_white() {\n  footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout.svg');\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction toggleTBbtn_default() {\n  footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout--green.svg');\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction toggleRowCB(row) {\n  if (sellingItem.amountPurchased === undefined && footer_tbChanged === true) {\n    _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default.a.showNotification('Please specify the number of items to be sold first', true);\n    footer_tb.focus();\n    return;\n  }\n\n  let CB = row.querySelector('.td_cb').querySelector('.selectOne');\n\n  if (CB.checked === true) {\n    CB.checked = false; // row.style.transform = \"translateX(0px)\"\n    // row.style.outline = \"none\"\n\n    if (totalSelectedRows > 0) {\n      totalSelectedRows = totalSelectedRows - 1;\n      cartCount.innerText = totalSelectedRows;\n    }\n\n    if (selectedRows === 0) {\n      disableDropDownList(); // cartCount.style.transform = \"scale(0)\"\n\n      cartCount.style.transform = \"scale(0)\";\n      cartCount.innerText = 0;\n    }\n  } else {\n    CB.checked = true;\n    totalSelectedRows = totalSelectedRows + 1;\n\n    if (totalSelectedRows > 0) {\n      enableDropDownList();\n\n      if (toolBarTB.disabled === false) {\n        footer_tb.focus();\n      }\n    }\n\n    markSelectedRow(row);\n  }\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction disableDropDownList() {\n  footer_tb.disabled = true;\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction enableDropDownList() {\n  footer_tb.disabled = false;\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction setSellingItemProperties(row) {\n  sellingItem.name = row.querySelector('.td_Names').innerText;\n  sellingItem.brand = row.querySelector('.td_Brands').innerText;\n  sellingItem.category = row.querySelector('.td_Category').innerText;\n} //-----------------------------------------------------------------------------------------------\n\n\nfunction amtPurchased(amntPurchased) {\n  sellingItem.amountPurchased = amntPurchased;\n} //-----------------------------------------------------------------------------------------------\n// function to show item in cart\n\n\nfunction showItemsInCart() {\n  cartCount.style.transform = \"scale(0)\";\n  cartCount.innerText = 0;\n} //-----------------------------------------------------------------------------------------------\n// Saving checked rows in \"selectedRows\"\n\n\nfunction markSelectedRow(row) {\n  let aRow = {};\n  aRow.key = row.querySelector('.td_Names').innerText;\n  aRow.value = row;\n  selectedRows.push(aRow);\n} // Uncheck checked rows. Does so by iterating through the arrray of \"selectedRows\" which contains all selectedRows\n\n\nfunction uncheckMarkedRows() {\n  selectedRows.forEach(row => {\n    row.value.querySelector('.td_cb').querySelector('.selectOne').checked = false;\n  });\n}\n\n//# sourceURL=webpack:///./controller/StoreController.js?");

/***/ }),

/***/ "./controller/utilities/TableController.js":
/*!*************************************************!*\
  !*** ./controller/utilities/TableController.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nclass TableController {\n  static createItem(name, brand, category, stock, sellingPrice, functions, hasItems, costPrice = \"\", purchased = \"\") {\n    const tableROWS = document.querySelector('tbody').querySelectorAll('tr'); //Removing Empty Banner Before Addition of new row\n\n    const emptyBanner = document.querySelector('.contentContainer').querySelector('.emptyBanner');\n    let returnedValue = true; //Check if Default Banner is attached to the contentContainer\n\n    if (emptyBanner !== null) {\n      emptyBanner.remove();\n    } //Destructing functions\n\n\n    let checkCB = functions[0];\n    let editItem = functions[1];\n    let deleteItem = functions[2];\n    let showRowControls = functions[3]; // creating new row element\n\n    const row = document.createElement(\"tr\");\n    const rowContent = `\n        <td class=\"controls\">\n            <div class=\"edit\"><span>Edit</span></div>\n            <div class=\"del\"><span>Delete</span></div>\n        </td>\n        <td class=\"td_cb\">\n            <input disabled type=\"checkbox\" class=\"selectOne\" aria-placeholder=\"select one\">\n        </td>\n        <td class=\"td_Names\">${name}</td>\n        <td class=\"td_Brands\">${brand}</td>\n        <td class=\"td_Category\">${category}</td>\n        <td class=\"td_Stock\">${stock}</td>\n        <td class=\"td_Price\">${sellingPrice}</td>\n        `;\n    row.innerHTML = rowContent;\n    row.className = \"bodyRow\";\n\n    if (hasItems === true) {\n      tableROWS.forEach(tableRow => {\n        if (tableRow.querySelector('.td_Names').innerText === row.querySelector('.td_Names').innerText) {\n          document.querySelector('.tableBody').replaceChild(row, tableRow);\n          console.log('matched');\n          returnedValue = 1;\n        } else {\n          document.querySelector(\".tableBody\").appendChild(row);\n          console.log('not matched');\n        }\n      });\n    } else if (hasItems !== true) {\n      document.querySelector(\".tableBody\").appendChild(row);\n      returnedValue = true;\n    }\n\n    row.scrollIntoView({\n      behavior: 'smooth'\n    });\n    /******************************Adding Event Listeners***************************************/\n\n    row.addEventListener(\"click\", () => {\n      checkCB(row);\n    });\n    row.querySelector(\".controls\").querySelector(\".edit\").addEventListener(\"click\", e => {\n      //Prevents selection of row\n      e.stopPropagation();\n      editItem(row);\n    });\n    row.querySelector(\".controls\").querySelector(\".del\").addEventListener(\"click\", e => {\n      //Prevents selection of row\n      e.stopPropagation();\n      deleteItem(row);\n    });\n    row.addEventListener(\"contextmenu\", e => {\n      showRowControls(row);\n    });\n    const initBGcolor = row.style.backgroundColor;\n    const initColor = row.style.color;\n    row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';\n    row.style.color = \"#fff\";\n    setTimeout(() => {\n      row.style.backgroundColor = initBGcolor;\n      row.style.color = initColor;\n    }, 3000);\n    console.log(returnedValue, \" tbC\");\n    return returnedValue;\n  }\n  /***********************************************************************************************************************************/\n\n  /******REMOVING ITEM FROM INVENTORY*****/\n\n\n  static removeItem(itemName) {\n    itemName = itemName.toLowerCase();\n    const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');\n    tableROWS.forEach(row => {\n      const item = row.querySelector(\".td_Names\");\n\n      if (item !== null && item.innerText.toLowerCase() === itemName) {\n        row.style.transition = \".7s\";\n        row.style.transform = \"translateX(150%)\";\n        setTimeout(() => {\n          row.remove();\n        }, 500);\n      }\n    });\n  }\n\n  static editItem(row, name, brand, category, stock, price) {\n    row.querySelector('.td_Names').innerText = name;\n    row.querySelector('.td_Brands').innerText = brand;\n    row.querySelector('.td_Category').innerText = category;\n    row.querySelector('.td_Stock').innerText = stock;\n    row.querySelector('.td_Price').innerText = price;\n    return true;\n  }\n  /***********************************************************************************************************************************/\n\n\n  static showIsEmpty() {\n    const tBody = document.querySelector('tbody');\n\n    if (tBody.rows.length !== 0) {\n      return;\n    }\n\n    const contentContainer = document.querySelector(\".contentContainer\");\n    const template = `\n            <center>\n\n                <img src=\"../img/empty.svg\" />\n                <span id=\"info\">\n                    Inventory Is Empty. Add New Items\n                    <img src=\"../Icons/toolBar/btnAdd--green.svg\" />\n                </span>\n\n            </center>\n            \n        \n       `;\n    let emptyBanner = document.createElement('div');\n    emptyBanner.className = \"emptyBanner\";\n    emptyBanner.innerHTML = template;\n    contentContainer.appendChild(emptyBanner);\n  }\n  /***********************************************************************************************************************************/\n  //    FilterS Items Table Based On Their Category Or Brand      FilterBy = either category or brand, Key =  the Classification type\n\n\n  static filterItems(filterBy, Key) {\n    const doneLoading = new Promise((resolve, reject) => {\n      filterBy = filterBy.toLowerCase();\n      Key = Key.toLowerCase();\n\n      switch (filterBy) {\n        case 'category':\n          filterBy = '.td_Category';\n          break;\n\n        case 'brand':\n          filterBy = '.td_Brands';\n          break;\n\n        default:\n          break;\n      }\n\n      const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');\n      tableRows.forEach(tableRow => {\n        if (tableRow.querySelector(filterBy).innerText.toLowerCase() !== Key) {\n          tableRow.style.display = 'none';\n\n          if (tableRow.classList.contains('sorted')) {\n            tableRow.classList.remove('sorted');\n          }\n        } else {\n          tableRow.style.display = 'flex';\n          tableRow.classList.add('sorted');\n        }\n      });\n      resolve();\n    });\n    doneLoading.then(() => {\n      this.removeOldBanners();\n    });\n    this.showLoadingBanner(\"Loading Please Wait\");\n  }\n\n  static resetTable() {\n    const doneLoading = new Promise((resolve, reject) => {\n      const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');\n      tableRows.forEach(tableRow => {\n        tableRow.style.display = 'flex';\n      });\n      resolve();\n    });\n    doneLoading.then(() => {\n      this.removeOldBanners();\n    });\n    this.showLoadingBanner(\"Loading Please Wait\");\n  }\n  /***********************************************************************************************************************************/\n\n\n  static showLoadingBanner(loadinInfo) {\n    this.removeOldBanners();\n    const tBody = document.querySelector('tbody');\n    const template = `\n                <center>\n\n                    <img src=\"../../utils/media/animations/loaders/Spin-1s-200px.svg\" alt=\"Loading..\" />\n                    <span id=\"info\">\n                        ${loadinInfo}\n                    </span>\n\n                </center>\n                \n            \n        `;\n    let emptyBanner = document.createElement('div');\n    emptyBanner.className = \"emptyBanner\";\n    emptyBanner.innerHTML = template;\n    const contentContainer = document.querySelector(\".contentContainer\");\n    contentContainer.appendChild(emptyBanner);\n  }\n\n  static removeOldBanners() {\n    const contentContainer = document.querySelector(\".contentContainer\");\n    const oldBanner = contentContainer.querySelector('.emptyBanner');\n\n    if (oldBanner !== null) {\n      oldBanner.remove();\n    }\n  }\n\n}\n\nmodule.exports = TableController;\n\n//# sourceURL=webpack:///./controller/utilities/TableController.js?");

/***/ })

/******/ });