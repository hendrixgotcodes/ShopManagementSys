"use strict";

const STORE = require('../../model/STORE');

const items_in_Categories = ["Books","Tissues"];
const items_in_Brands = ["Ghana Schools", "N/A"];


let userName, userType;


//ToolTip will be shown based on this
let showToolTips;


ipcRenderer.on("loadUserInfo", (e, array)=>{

  return new Promise((resolve, reject)=>{

        [userName, userType] = array;

        resolve();

  }).then(()=>{

        if(userType === 'Admin'){
        
        
          const store = new STORE({
              configName: 'userPrefs',
              defaults: {
                  toolTipsPref: 'show',
                  timeOutPref: '1',
              }
          });
        
          let userPrefered = store.get("toolTipsPref").toString();
        
        
          if(userPrefered === "show"){
              showToolTips = true;
          }
          else if(userPrefered === "hide"){
            showToolTips = false;
        
          }
          
        }

  }).then(()=>{

      if(showToolTips === true){

        setToolTips();

      }

  })

  
})




const selectValue_span = document.querySelector('.selectValue_span');


import tippy, {
  roundArrow
} from 'tippy.js';
import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import '../../node_modules/tippy.js/themes/material.css';
import "../../node_modules/tippy.js/themes/light.css";
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/perspective.css'
import TableController from './TableController';
import { ipcRenderer } from 'electron';




/************************Popup Menu for "FilterBy"**************************/

//Unordered lists which will be passed into tippyJS
const ul_categories = document.createElement('ul');
const ul_brands = document.createElement('ul');

ul_categories.setAttribute("tabIndex", "0");
ul_brands.setAttribute("tabIndex", "0");


// Dynamically adding list items based on categories and brands respectively
items_in_Categories.forEach((item) => {

  let newItem = document.createElement('li');
  newItem.innerHTML = item;
  newItem.className = "selectDropdown_value";
  newItem.setAttribute("tabIndex", "0");

  newItem.addEventListener("click", () => {

    TableController.filterItems("Category", newItem.innerText)

    const wrapped =  wrapText(newItem.innerHTML)

    selectValue_span.innerHTML = wrapped;
    selectValue_span.setAttribute("value", wrapped)
  })

  ul_categories.appendChild(newItem);

});

items_in_Brands.forEach((item) => {

  let newItem = document.createElement('li');
  newItem.innerText = item;
  newItem.className = "selectDropdown_value";
  newItem.setAttribute("tabIndex", "0");


  ul_brands.appendChild(newItem);

  newItem.addEventListener("click", () => {

    TableController.filterItems("Brand", newItem.innerText)

    const wrapped =  wrapText(newItem.innerHTML)

    selectValue_span.innerHTML = wrapped;
    selectValue_span.setAttribute("value", wrapped)
  })

});




tippy('.tip_category', {
  content: ul_categories,
  placement: 'right-start',
  theme: 'white',
  arrow: false,
  offset: [0, 0],
  animation: 'perspective',
})

tippy('.tip_brand', {
  content: ul_brands,
  placement: 'right-start',
  theme: 'white',
  arrow: false,
  offset: [0, 0]
})



/*******************************************FUNCTIONS**********************************/
function wrapText(text){

  return text.length > 5 ? text.slice(0,5) + '....' : text;
 
}

/************************TOOLTIP INSTANCES**************/
// Form check
let tip_formCheck, tip_storeFront, tip_inventory, tip_analytics, tip_account, tip_settings;


function setToolTips(){


        let span = document.createElement('span');
        span.innerText = 'Toggle password visibility';
        span.className = 'tooltip_cb';
        
        tippy.setDefaultProps({
          interactive: true,
          placement: "right",
          theme: 'tomato',
          arrow: true,
          // arrow: roundArrow,
        })
        
        tippy(`.form_check`, {
          content: span,
        })
        
        
        
        // SHOP PAGE TOOLTIP
        let storeFront = document.createElement('span');
        storeFront.innerText = 'Store front';
        storeFront.className = 'tooltip_cb';
        
        let inventory = document.createElement('span');
        inventory.innerText = 'Inventory';
        inventory.className = 'tooltip_cb';
        
        
        let analytics = document.createElement('span');
        analytics.innerText = 'Analytics';
        analytics.className = 'tooltip_cb';
        
        let info = document.createElement('span');
        info.innerText = 'Info';
        info.className = 'tooltip_cb';
        
        let settings = document.createElement('span');
        settings.innerText = 'General Settings';
        settings.className = 'tooltip_cb';
        
        
        tip_storeFront = tippy('.tip_store', {
                           content: storeFront
                         });
                        
        tip_inventory = tippy('.tip_inventory', {
                          content: inventory
                        });
              
        tip_analytics = tippy('.tip_analytics', {
                          content: analytics
                        })
        
        tip_account = tippy('#account', {
                        content: info,
                        placement: 'bottom'
                      })
        
        tip_settings = tippy('#settings', {
                        content: settings,
                        placement: 'bottom'
                      })



}
