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
/***/ (function(module, exports, __webpack_require__) {

const {
  shell
} = __webpack_require__(/*! electron */ "electron");
/***********AUDIO FILES*********/
// const winAlert = new Audio('../../utils/media/syssounds/win10.mp3')

/**********DOM ELEMENTS*********/


const notification_banner = document.querySelector('.notification_banner');

class Notifications {
  static showNotification(message, boolean) {
    notification_banner.querySelector('span').innerText = message;
    notification_banner.style.transform = "translateX(0%)";

    if (boolean === true) {
      notification_banner.querySelector('.banner_arrow').classList.add("banner_arrow--show");
      console.log(true);
    }

    shell.beep();
    setTimeout(() => {
      Notifications.hideNotification();

      if (notification_banner.querySelector('.banner_arrow').classList.contains('banner_arrow--show')) {
        notification_banner.querySelector('.banner_arrow').classList.remove("banner_arrow--show");
      }
    }, 5000);
  }

  static hideNotification() {
    notification_banner.style.transform = "translateX(100%)";
  }

  static showAlert(errorType, message) {
    const mainBodyContent = document.querySelector(".mainBody_content");
    errorType = errorType.toLowerCase();
    let bGColor;

    switch (errorType) {
      case 'success':
        bGColor = "#12A89D";
        break;

      case 'warning':
        bGColor = "#E17C38";
        break;

      case 'error':
        bGColor = " #ce2727";
        break;

      default:
        bGColor = "#12A89D";
    }

    let alertTemplate = `
            <img class="img_close" src="../Icons/Modals/closeWhite.svg" alt="Close Modal" />
            <div class="alertContent">
                ${message}
            </div>
        `;
    let alert = document.createElement("div");
    alert.innerHTML = alertTemplate;
    alert.className = "alertBanner";
    alert.style.backgroundColor = bGColor;
    (function Animate() {
      return new Promise((resolve, reject) => {
        mainBodyContent.appendChild(alert);
        resolve();
      });
    })().then(() => {
      setTimeout(() => {
        mainBodyContent.querySelector(".alertBanner").classList.add("alertBanner--shown");
      }, 300); //Automatically remove after three seconds

      setTimeout(() => {
        (function Animate() {
          return new Promise((resolve, reject) => {
            mainBodyContent.querySelector(".alertBanner").classList.remove("alertBanner--shown"); // function will resolve after animation is document (animation takes .5s, function resolves after .6s)

            setTimeout(() => {
              resolve();
            }, 600);
          });
        })().then(() => {
          //Removing alertbanner from DOM to increase performance
          mainBodyContent.querySelector(".alertBanner").remove();
        });
      }, 5000);
    });
  }

}

module.exports = Notifications;

/***/ }),

/***/ "./controller/StoreController.js":
/*!***************************************!*\
  !*** ./controller/StoreController.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controller/Alerts/NotificationController */ "./controller/Alerts/NotificationController.js");
/* harmony import */ var _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _modals_ModalController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modals/ModalController */ "./controller/modals/ModalController.js");
/* harmony import */ var _utilities_TableController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities/TableController */ "./controller/utilities/TableController.js");
/* harmony import */ var _utilities_TableController__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_utilities_TableController__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utilities/UnitConverter */ "./controller/utilities/UnitConverter.js");
/* harmony import */ var _utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_3__);

/**
 * @param {HTMLTableElement} tableEl
 */

/**********************************IMPORTED ***************************/





/*********************************PROGRAM CONSTANTS********************* */

const cart = []; // Array of store objects

let salesMade = 0; //Total sold Items
//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount

let totalSelectedRows = 0;
let footer_tbChanged = false;
/*********************************DOM ELEMENTS********************* */

const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const toolBarBtn = document.querySelector('.toolBar_btn');
const mainBodyContent = document.querySelector('.mainBody_content');
const footer_btn = document.querySelector('.footer_btn');
const footer_btn_icon = document.querySelector('.ico_footer_btn');
const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');
const footer_tb = document.querySelector('.footer_tb');
const cartCount = document.querySelector('.cartCount');
/***********************************OBJECTS**************/

let sellingItem = {// Represents an instance of a store item being added to cart
};
/*********************************EVent Listeners********************* */

tip_default.addEventListener('click', () => {
  selectValue_span.innerHTML = "Filter By:";
  selectValue_span.setAttribute("value", "default");
  _utilities_TableController__WEBPACK_IMPORTED_MODULE_2___default.a.resetTable();
}); //For ToolBarBtn

toolBarBtn.addEventListener('click', e => {
  e.preventDefault();
  seek(toolBarTB.value);
}); //For "footer_btn"

footer_btn.addEventListener('mouseover', toggleTBbtn_white);
footer_btn.addEventListener('mouseleave', toggleTBbtn_default);
footer_btn.addEventListener("click", e => {
  e.preventDefault(); //Displays Modal to show selected Items

  showItemsInCart(); // calling function to uncheck checked rows
  // uncheckMarkedRows()
}); //For "tableBody"

tableROWS.forEach(row => {
  row.addEventListener('click', e => {
    toggleRowCB(row);
    setSellingItemProperties(row);
  });
}); //For "footer_tb"

footer_tb.addEventListener("blur", () => {
  if (sellingItem.amountPurchased !== undefined && footer_tbChanged !== true) {
    disableDropDownList();
    footer_tb.selectedIndex = 0; //Resets Default value of drop down list

    cart.push(sellingItem);
    sellingItem = {};
  }
});
footer_tb.addEventListener("change", () => {
  cartCount.style.transform = "scale(1)";
  cartCount.innerText = totalSelectedRows;
  sellingItem.amountPurchased = footer_tb.value;
  footer_tbChanged = false;

  if (footer_tb.selectedIndex > 1) {
    footer_btn.disabled = false;
  }
});
footer_tb.addEventListener("focus", () => {
  footer_tbChanged = true;
  console.log(footer_tbChanged);
});
/*************************************FUNCTIONS********************* */

/*************************************FUNCTIONS********************* */

/*************************************FUNCTIONS********************* */

/*************************************FUNCTIONS********************* */

/*************************************FUNCTIONS********************* */
//-----------------------------------------------------------------------------------------------
// Searchs for an element in the Table

function seek(variable) {
  let notFound = true;
  tableROWS.forEach(row => {
    if (row.querySelector('.td_Names').innerText.toLowerCase() === variable.toLowerCase()) {
      row.scrollIntoView({
        behavior: 'smooth'
      });
      const initBGcolor = row.style.backgroundColor;
      const initColor = row.style.color;
      row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';
      row.style.color = "#fff";
      setTimeout(() => {
        row.style.backgroundColor = initBGcolor;
        row.style.color = initColor;
      }, 3000);
      notFound = false;
      return;
    }
  });

  if (notFound === true) {
    _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default.a.showNotification("Item not found");
  }
} //-----------------------------------------------------------------------------------------------
//Opens Setting modal


function removeSettingsModal(cover) {
  if (mainBodyContent.querySelector('.settingsModal') !== null) {
    mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
  }

  cover.classList.toggle('contentCover--shown');
} //-----------------------------------------------------------------------------------------------


function toggleTBbtn_white() {
  footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout.svg');
} //-----------------------------------------------------------------------------------------------


function toggleTBbtn_default() {
  footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout--green.svg');
} //-----------------------------------------------------------------------------------------------


function toggleRowCB(row) {
  if (sellingItem.amountPurchased === undefined && footer_tbChanged === true) {
    _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default.a.showNotification('Please specify the number of items to be sold first', true);
    footer_tb.focus();
    return;
  } //Checkbox


  let CB = row.querySelector('.td_cb').querySelector('.selectOne');

  if (CB.checked === true) {
    //Unchecking checkbox in clicked
    CB.checked = false; //Item being unchecked

    let itemName = row.querySelector('.td_Names').innerText;
    let itemBrand = row.querySelector('.td_Brands').innerText;
    cart.forEach(item => {
      let currentItemIndex;

      if (item.name === itemName && item.brand === itemBrand) {
        currentItemIndex = cart.indexOf(item);
        cart.splice(currentItemIndex, 1);
      }
    });

    if (totalSelectedRows > 0) {
      totalSelectedRows = totalSelectedRows - 1;
      cartCount.innerText = totalSelectedRows;
    }

    if (totalSelectedRows === 0) {
      disableDropDownList(); //Disabling footer_btn (checkout btn)

      footer_btn.disabled = true; // cartCount.style.transform = "scale(0)"

      cartCount.style.transform = "scale(0)";
      cartCount.innerText = 0;
    }
  } else {
    CB.checked = true;
    totalSelectedRows = totalSelectedRows + 1;

    if (totalSelectedRows > 0) {
      enableDropDownList();

      if (toolBarTB.disabled === false) {
        footer_tb.focus();
      }
    }
  }
} //-----------------------------------------------------------------------------------------------


function disableDropDownList() {
  footer_tb.disabled = true;
} //-----------------------------------------------------------------------------------------------


function enableDropDownList() {
  footer_tb.disabled = false;
} //-----------------------------------------------------------------------------------------------


function setSellingItemProperties(row) {
  sellingItem.name = row.querySelector('.td_Names').innerText;
  sellingItem.brand = row.querySelector('.td_Brands').innerText;
  sellingItem.category = row.querySelector('.td_Category').innerText;
  sellingItem.price = row.querySelector('.td_Price').innerText;
} //-----------------------------------------------------------------------------------------------


function amtPurchased(amntPurchased) {
  sellingItem.amountPurchased = amntPurchased;
} //-----------------------------------------------------------------------------------------------
// function to show item in cart


function showItemsInCart() {
  console.log(cart);
  _modals_ModalController__WEBPACK_IMPORTED_MODULE_1__["default"].createCheckout(cart, totalSelectedRows, cartCount).then(totalCost => {
    if (totalCost >= 0) {
      salesMade = salesMade + totalCost; //Parsing it through a converter

      let forSpan = _utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_3___default.a.convert(salesMade);
      document.querySelector('#salesMade_amount').innerText = forSpan;
      _controller_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default.a.showAlert("success", "Sales Made Successfully");
      cart = [];
      totalSelectedRows = 0;
    }
  });
} //-----------------------------------------------------------------------------------------------

/***/ }),

/***/ "./controller/modals/ModalController.js":
/*!**********************************************!*\
  !*** ./controller/modals/ModalController.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Alerts/NotificationController */ "./controller/Alerts/NotificationController.js");
/* harmony import */ var _Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Alerts_NotificationController__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/UnitConverter */ "./controller/utilities/UnitConverter.js");
/* harmony import */ var _utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_1__);





const TableController = __webpack_require__(/*! ../utilities/TableController */ "./controller/utilities/TableController.js");

class Modal {
  static openPrompt(itemName = "", resolve, reject, justVerify = "", customMessage = "") {
    let defaultMessage = "Please Enter Your Password To Continue";

    if (customMessage !== "") {
      defaultMessage = customMessage;
    }

    const boxTemplate = `
                    <div class="dialogContainer fullwidth aDialog" role="container">
                        <div class="dialogHeader" role="header">

                            <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
                            <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />

                        </div>

                        <div class="dialogBody fullwidth" role="body">
                        <span>
                                ${defaultMessage}
                            </span>

                            <input type="password" class="modal_pass" aria-placeholder="enter password here" placeholder="Enter Your Password Here" />

                        </div>

                        <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                            <div class="dialogConfirm">
                                Confirm
                            </div>
                        </div>

                    </div>
                `;
    const promptBox = document.createElement('div');
    promptBox.className = "modal dialog--promptBox";
    promptBox.setAttribute("aria-placeholder", "Prompt Box");
    promptBox.innerHTML = boxTemplate;
    openModal(promptBox); //Event Listener

    promptBox.querySelector('.img_close').addEventListener("click", () => {
      closePromptBox(promptBox, resolve, reject);
    });
    promptBox.querySelector('.dialogConfirm').addEventListener("click", () => {
      confirmRemove(itemName, resolve, reject, justVerify); //ItemName and Item are basically the same but kinda acts as flags to polymorphism of this function
    });
  }
  /************************************************************************************************************************************************************************/
  //Confirmation DialogBox


  static openConfirmationBox(itemName, itemCount) {
    return new Promise((resolve, reject) => {
      const boxTemplate = `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
                        <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
                    </div>
    
                    <div class="dialogBody fullwidth" role="body">
                       <span>
                                Are You Sure You Want To Delete ${itemName} which has 
                                a quantity of (${itemCount}) from the Inventory.
                        </span>
    
                    </div>
    
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Yes, Delete
                        </div>
                        <div class="dialogRevert">
                            Review Selection
                        </div>
                    </div>
    
                </div>
            `;
      const confirmationBox = document.createElement('div');
      confirmationBox.className = "modal dialog--confirmationBox";
      confirmationBox.setAttribute("aria-placeholder", "Confirm Box");
      confirmationBox.innerHTML = boxTemplate;
      const mainBodyContent = document.querySelector('.mainBody_content');
      mainBodyContent.appendChild(confirmationBox);
      document.querySelector('.contentCover').classList.add('contentCover--shown');
      setTimeout(() => {
        mainBodyContent.querySelector(".dialog--confirmationBox").classList.add("dialog--confirmationBox--shown");
      }, 100); //Event Listener

      confirmationBox.querySelector('.img_close').addEventListener("click", () => closeConfirmationBox(resolve, reject));
      confirmationBox.querySelector(".dialogRevert").addEventListener("click", () => closeConfirmationBox(resolve, reject));
      confirmationBox.querySelector(".dialogConfirm").addEventListener("click", () => {
        openPrompt(itemName, resolve, reject);
      });
    });
  }
  /************************************************************************************************************************************************************************/


  static openItemForm(row = "", editForm) {
    return new Promise((resolve, reject) => {
      let formTitle = editForm === true ? "Edit Stock" : "New Stock";
      let itemName = "";
      let brand = "";
      let category = "";
      let itemQuantity = "";
      let sellingPrice = "";

      if (row !== "") {
        itemName = row.querySelector(".td_Names").innerText;
        brand = row.querySelector(".td_Brands").innerText;
        category = row.querySelector(".td_Category").innerText;
        itemQuantity = row.querySelector(".td_Stock").innerText;
        sellingPrice = row.querySelector(".td_Price").innerText;
      }

      const boxTemplate = `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
    
                        ${formTitle}    
    
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
    
                    </div>
    
                    <form class="dialogBody fullwidth" role="body">
    
                            <input type="text" class="dialogForm_tb fullwidth" value="${itemName}" aria-placeholder="Item Name" placeholder="Item Name" id="name" />
    
                         <div class="flexContainer">   
                            <input type="text" class="dialogForm_tb halfwidth" value="${category}" aria-placeholder="Item Category" placeholder="Item Category" id="category" />
    
                            <input type="text" class="dialogForm_tb halfwidth" value="${brand}" aria-placeholder="Item Brand" placeholder="Item Brand" id="brand" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${itemQuantity}" aria-placeholder="Total in inventory" placeholder="Total In Inventory" id="total" />
    
                            <input type="number" class="dialogForm_tb halfwidth" aria-placeholder="Cost Price" placeholder="Cost Price" id="costPrice" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${sellingPrice}" aria-placeholder="Unit Cost" placeholder="Selling Price" id="sellingPrice" />
    
                         </div>
    
                    </form>
    
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Save
                            <img src="../Icons/Modals/add.svg" alt="Confirmation Message" />
                        </div>
                    </div>
    
                </div>
            `;
      const itemForm = document.createElement('div');
      itemForm.className = "modal dialog--itemFormBox";
      itemForm.classList.add("dialog--promptBox");
      itemForm.setAttribute("aria-placeholder", "Confirm Box");
      itemForm.innerHTML = boxTemplate;
      const mainBodyContent = document.querySelector('.mainBody_content');
      mainBodyContent.appendChild(itemForm);
      document.querySelector('.contentCover').classList.add('contentCover--shown');
      setTimeout(() => {
        mainBodyContent.querySelector(".dialog--itemFormBox").classList.add("dialog--shown");
      }, 100); //Event Listeners

      itemForm.querySelector('.img_close').addEventListener("click", exitBox);
      itemForm.querySelector('.dialogConfirm').addEventListener("click", saveFormData);

      function saveFormData() {
        //Form Data
        const name = itemForm.querySelector('#name').value;
        const category = itemForm.querySelector('#category').value;
        const brand = itemForm.querySelector('#brand').value;
        const stock = itemForm.querySelector('#total').value;
        const sellingPrice = itemForm.querySelector('#sellingPrice').value;
        const costPrice = itemForm.querySelector("#costPrice").value; // console.log(name, category, brand, stock, price);

        if (name !== "" && category !== "" && brand !== "" && stock !== "" && sellingPrice !== "") {
          closeModal(itemForm); // openPrompt("",resolve,reject, [true, row, name, brand, category, stock, sellingPrice])

          resolve([true, row, name, brand, category, stock, sellingPrice, costPrice]);
        }
      }

      function exitBox() {
        closeConfirmationBox(resolve, reject);
      }
    });
  }
  /************************************************************************************************************************************************************************/


  static createCheckout(cart, totalSelectedRows, cartCount) {
    return new Promise((resolve, reject) => {
      let totalPrice = 0;
      cart.forEach(item => {
        totalPrice += parseFloat(item.price * item.amountPurchased);
      });
      totalPrice = parseFloat(totalPrice).toFixed(2);
      const formTemplate = `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">

                        <span>In Cart</span>

                        <span id="lblPrice"> <b>Gh¢ ${_utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_1___default.a.convert(totalPrice)} </b></span>
                        
                    </div>

                    <div class="scrollBox">

                    </div>

                
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Sell
                            <img src="../Icons/Modals/add.svg" alt="Confirmation Message" />
                        </div>
                    </div>

                </div>
                    
            `;
      const itemForm = document.createElement('div');
      itemForm.className = "modal dialog--cartForm";
      itemForm.classList.add("dialog--promptBox");
      itemForm.setAttribute("aria-placeholder", "Confirm Box");
      itemForm.setAttribute('tabindex', '1');
      itemForm.innerHTML = formTemplate;
      const mainBodyContent = document.querySelector('.mainBody_content'); // mainBodyContent.appendChild(itemForm);

      openModal(itemForm); //Giving focus to form immediately after its added to the DOM

      itemForm.focus();
      document.querySelector('.contentCover').classList.add('contentCover--shown');
      setTimeout(() => {
        mainBodyContent.querySelector(".dialog--cartForm").classList.add("dialog--shown");
      }, 100); //Adding Items to List

      let scrollBox = itemForm.querySelector('.scrollBox');
      cart.forEach(item => {
        let itemTemplate = `
                            <div class="itemInfo" id="name"><span>${item.name}</span></div>
                            <div class="itemInfo" id="brand"><span>${item.brand}</span></div>
                            <div class="itemInfo" id="amount"><span>x${item.amountPurchased}</span></div>
                            <div class="itemInfo" id="costSection"><span>Gh¢ <span id="cost"> ${parseFloat(item.amountPurchased * item.price).toFixed(2)}</span></span></div>
                            <div class="delItem"> <img src="../Icons/Modals/closeWhite.svg" alt="delete" /> </div>
                        `;
        let newRow = document.createElement('div');
        newRow.className = "modalItem";
        newRow.innerHTML = itemTemplate;
        newRow.querySelector('.delItem').addEventListener('click', e => {
          removeItem(e);
        });
        scrollBox.appendChild(newRow);
      });
      /***************************EVENT LISTENERS*****************************/

      itemForm.querySelector('.dialogConfirm').addEventListener("click", sellItems);
      itemForm.addEventListener('blur', exitBox);
      /***************************FUNCTIONS*****************************/
      //Sell button function

      function sellItems() {
        exitBox();
        resolve(totalPrice);
      } //Function called to close modal


      function exitBox() {
        closeModal(itemForm);
        document.querySelector('.contentCover').classList.remove('contentCover--shown');
      } // Function called to remove items (divs) in cart


      function removeItem(e) {
        // Animating item (slide right)
        e.target.parentElement.parentElement.style.transform = 'translateX(100%)'; //Remove element after animation

        setTimeout(() => {
          e.target.parentElement.parentElement.remove();
          let name = e.target.parentElement.parentElement.querySelector('#name').innerText;
          let brand = e.target.parentElement.parentElement.querySelector('#brand').innerText;
          totalSelectedRows = totalSelectedRows - 1; //Modifying span on checkout box

          cartCount.innerText = totalSelectedRows;

          if (totalSelectedRows === 0) {
            cartCount.style.transform = "scale(0)";
          } //Uncheking Corresponding row in table


          TableController.uncheckRows(name, brand); //Subtracting prices of removed items from main total cost

          let itemPrice = e.target.parentElement.parentElement.querySelector('#costSection').querySelector('#cost').innerText;
          itemPrice = parseFloat(itemPrice);
          totalPrice = totalPrice - itemPrice;
          console.log(totalPrice, " ", itemPrice);
          itemForm.querySelector('#lblPrice').innerHTML = `<b>Gh¢ ${_utilities_UnitConverter__WEBPACK_IMPORTED_MODULE_1___default.a.convert(totalPrice)} </b>`;
          /****Removing item from cart array****/
          // For each item in cart array

          cart.forEach(item => {
            let currentItemIndex; //If 

            if (item.name === name && item.brand === brand) {
              currentItemIndex = cart.indexOf(item);
              cart.splice(currentItemIndex, 1);
            }
          });

          if (cart.length === 0) {
            closeModal(itemForm);
          }

          resolve();
        }, 400);
      }
    });
  }

}
/*****************************************************************************FUNCTIONS***************************************************************/
///Event Listener Functions


function closeConfirmationBox(resolve, reject, edited = "", name = "") {
  if (mainBodyContent.querySelector('.modal') !== null) {
    // document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
    // document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)
    mainBodyContent.querySelector('.modal').remove();
    document.querySelector('.contentCover').classList.remove('contentCover--shown');

    if (edited === true) {
      resolve(["edited", name]);
    } else {
      resolve();
    }
  } else {
    reject(new Error("Sorry, an error occured"));
  }
} //For Confirmation Box


function openPrompt(itemName, resolve, reject, justVerify = "") {
  if (mainBodyContent.querySelector('.modal') !== null) {
    //document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
    //document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)
    mainBodyContent.querySelector('.modal').remove();
  }

  Modal.openPrompt(itemName, resolve, reject, justVerify);
} //For Prompt bOX


function closePromptBox(modal, resolve, reject) {
  if (mainBodyContent.querySelector('.modal') !== null) {
    // mainBodyContent.querySelector('.modal').remove();
    closeModal(modal);
    document.querySelector('.contentCover').classList.remove('contentCover--shown');
    resolve();
  }
} // Validates password provided in prompt box and removes removes specified element


function confirmRemove(itemName, resolve, reject, justVerify = "") {
  const modal = mainBodyContent.querySelector('.modal');
  const Password = document.querySelector('.dialog--promptBox').querySelector(".modal_pass").value;

  if (Password === "Duffy") {
    closeModal(modal);
    document.querySelector('.contentCover').classList.remove('contentCover--shown');

    if (justVerify[0] === true) {
      resolve(["edited", justVerify]);
      return;
    }

    resolve("verified");
    console.log("removed");
  } else {
    reject(new Error("wrongPassword"));
    closeModal(modal);
    document.querySelector('.contentCover').classList.remove('contentCover--shown');
  }
}

function closeModal(modal) {
  if (!modal.classList.contains("dialog--shown")) {
    modal.classList.add('modal_hide');
  }

  modal.classList.remove('dialog--shown');
  setTimeout(() => {
    modal.remove();
  }, 400);
}

function openModal(modal) {
  // let mainBodyContent= document.querySelector(".main")
  if (!document.querySelector(".contentCover").classList.contains("contentCover--shown")) {
    document.querySelector(".contentCover").classList.add("contentCover--shown");
  }

  ;
  const mainBodyContent = document.querySelector('.mainBody_content');
  mainBodyContent.appendChild(modal);
  setTimeout(() => {
    modal.classList.add("dialog--shown");
  }, 100);
  mainBodyContent.appendChild(modal);
}

/* harmony default export */ __webpack_exports__["default"] = (Modal);

/***/ }),

/***/ "./controller/utilities/TableController.js":
/*!*************************************************!*\
  !*** ./controller/utilities/TableController.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


class TableController {
  static createItem(name, brand, category, stock, sellingPrice, functions, hasItems, costPrice = "", purchased = "") {
    const tableROWS = document.querySelector('tbody').querySelectorAll('tr'); //Removing Empty Banner Before Addition of new row

    const emptyBanner = document.querySelector('.contentContainer').querySelector('.emptyBanner');
    let returnedValue = true; //Check if Default Banner is attached to the contentContainer

    if (emptyBanner !== null) {
      emptyBanner.remove();
    } //Destructing functions


    let checkCB = functions[0];
    let editItem = functions[1];
    let deleteItem = functions[2];
    let showRowControls = functions[3]; // creating new row element

    const row = document.createElement("tr");
    const rowContent = `
        <td class="controls">
            <div class="edit"><span>Edit</span></div>
            <div class="del"><span>Soft Delete</span></div>
        </td>
        <td class="td_cb">
            <input disabled type="checkbox" class="selectOne" aria-placeholder="select one">
        </td>
        <td class="td_Names">${name}</td>
        <td class="td_Brands">${brand}</td>
        <td class="td_Category">${category}</td>
        <td class="td_Stock">${stock}</td>
        <td class="td_Price">${sellingPrice}</td>
        `;
    row.innerHTML = rowContent;
    row.className = "bodyRow";

    if (hasItems === true) {
      tableROWS.forEach(tableRow => {
        if (tableRow.querySelector('.td_Names').innerText === row.querySelector('.td_Names').innerText) {
          document.querySelector('.tableBody').replaceChild(row, tableRow);
          console.log('matched');
          returnedValue = 1;
        } else {
          document.querySelector(".tableBody").appendChild(row);
          console.log('not matched');
        }
      });
    } else if (hasItems !== true) {
      document.querySelector(".tableBody").appendChild(row);
      returnedValue = true;
    }

    row.scrollIntoView({
      behavior: 'smooth'
    });
    /******************************Adding Event Listeners***************************************/

    row.addEventListener("click", () => {
      checkCB(row);
    });
    row.querySelector(".controls").querySelector(".edit").addEventListener("click", e => {
      //Prevents selection of row
      e.stopPropagation();
      editItem(row);
    });
    row.querySelector(".controls").querySelector(".del").addEventListener("click", e => {
      //Prevents selection of row
      e.stopPropagation();
      deleteItem(row);
    });
    row.addEventListener("contextmenu", e => {
      showRowControls(row);
    });
    const initBGcolor = row.style.backgroundColor;
    const initColor = row.style.color;
    row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)';
    row.style.color = "#fff";
    setTimeout(() => {
      row.style.backgroundColor = initBGcolor;
      row.style.color = initColor;
    }, 3000);
    console.log(returnedValue, " tbC");
    return returnedValue;
  }
  /***********************************************************************************************************************************/

  /******REMOVING ITEM FROM INVENTORY*****/


  static removeItem(itemName, itemBrand) {
    itemName = itemName.toLowerCase();
    itemBrand = itemBrand.toLowerCase();
    const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');
    tableROWS.forEach(row => {
      const name = row.querySelector(".td_Names").innerText.toLowerCase();
      const brand = row.querySelector(".td_Brands").innerText.toLowerCase();

      if (row !== null && name === itemName && brand === itemBrand) {
        row.style.transition = ".7s";
        row.style.transform = "translateX(150%)";
        setTimeout(() => {
          row.remove();
        }, 500);
      }
    });
  }

  static editItem(row, name, brand, category, stock, price) {
    row.querySelector('.td_Names').innerText = name;
    row.querySelector('.td_Brands').innerText = brand;
    row.querySelector('.td_Category').innerText = category;
    row.querySelector('.td_Stock').innerText = stock;
    row.querySelector('.td_Price').innerText = price;
    return true;
  }
  /***********************************************************************************************************************************/


  static showIsEmpty() {
    const tBody = document.querySelector('tbody');

    if (tBody.rows.length !== 0) {
      return;
    }

    const contentContainer = document.querySelector(".contentContainer");
    const template = `
            <center>

                <img src="../img/empty.svg" />
                <span id="info">
                    Inventory Is Empty. Add New Items
                    <img src="../Icons/toolBar/btnAdd--green.svg" />
                </span>

            </center>
            
        
       `;
    let emptyBanner = document.createElement('div');
    emptyBanner.className = "emptyBanner";
    emptyBanner.innerHTML = template;
    contentContainer.appendChild(emptyBanner);
  }
  /***********************************************************************************************************************************/
  //    FilterS Items Table Based On Their Category Or Brand      FilterBy = either category or brand, Key =  the Classification type


  static filterItems(filterBy, Key) {
    const doneLoading = new Promise((resolve, reject) => {
      filterBy = filterBy.toLowerCase();
      Key = Key.toLowerCase();

      switch (filterBy) {
        case 'category':
          filterBy = '.td_Category';
          break;

        case 'brand':
          filterBy = '.td_Brands';
          break;

        default:
          break;
      }

      const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');
      tableRows.forEach(tableRow => {
        if (tableRow.querySelector(filterBy).innerText.toLowerCase() !== Key) {
          tableRow.style.display = 'none';

          if (tableRow.classList.contains('sorted')) {
            tableRow.classList.remove('sorted');
          }
        } else {
          tableRow.style.display = 'flex';
          tableRow.classList.add('sorted');
        }
      });
      resolve();
    });
    doneLoading.then(() => {
      this.removeOldBanners();
    });
    this.showLoadingBanner("Loading Please Wait");
  }

  static resetTable() {
    const doneLoading = new Promise((resolve, reject) => {
      const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');
      tableRows.forEach(tableRow => {
        tableRow.style.display = 'flex';
      });
      resolve();
    });
    doneLoading.then(() => {
      this.removeOldBanners();
    });
    this.showLoadingBanner("Loading Please Wait");
  }
  /***********************************************************************************************************************************/


  static showLoadingBanner(loadinInfo) {
    this.removeOldBanners();
    const tBody = document.querySelector('tbody');
    const template = `
                <center>

                    <img src="../../utils/media/animations/loaders/Spin-1s-200px.svg" alt="Loading.." />
                    <span id="info">
                        ${loadinInfo}
                    </span>

                </center>
                
            
        `;
    let emptyBanner = document.createElement('div');
    emptyBanner.className = "emptyBanner";
    emptyBanner.innerHTML = template;
    const contentContainer = document.querySelector(".contentContainer");
    contentContainer.appendChild(emptyBanner);
  }

  static removeOldBanners() {
    const contentContainer = document.querySelector(".contentContainer");
    const oldBanner = contentContainer.querySelector('.emptyBanner');

    if (oldBanner !== null) {
      oldBanner.remove();
    }
  }

  static uncheckRows(name, brand) {
    const tRows = document.querySelector('tbody').querySelectorAll('tr');
    console.log(name, brand);
    tRows.forEach(row => {
      let rowName = row.querySelector('.td_Names').innerText;
      let rowBrand = row.querySelector('.td_Brands').innerText;
      let checkbox = row.querySelector('.td_cb').querySelector('.selectOne');

      if (rowName === name && rowBrand === brand) {
        checkbox.checked = false;
        console.log('checked');
      } else {
        console.log('not cheked');
      }
    });
  }

}

module.exports = TableController;

/***/ }),

/***/ "./controller/utilities/UnitConverter.js":
/*!***********************************************!*\
  !*** ./controller/utilities/UnitConverter.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class UnitConverter {
  static convert(value) {
    value = Number.parseFloat(value);

    if (value >= 1000) {
      value = (value / 1000).toFixed(2) + ' K';
    } else if (value >= 1000000) {
      value = (value / 1000000).toFixed(2) + ' M';
      console.log(value);
    } else if (value >= 1000000000) {
      value = (value / 1000000000).toFixed(2) + ' B';
      console.log(value);
    } else {
      value = value.toFixed(2);
      console.log(value);
    }

    return value;
  }

}

module.exports = UnitConverter;

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ })

/******/ });
//# sourceMappingURL=StoreController.js.map