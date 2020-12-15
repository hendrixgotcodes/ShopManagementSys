"use strict";

import tippy from 'tippy.js';
import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import '../../node_modules/tippy.js/themes/material.css';
import "../../node_modules/tippy.js/themes/light.css";
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/perspective.css'
import TableController from './TableController';
import { ipcRenderer } from 'electron';
import DATABASE from '../../model/DATABASE';


const STORE = require('../../model/STORE');
const database = new DATABASE();




let userName, userType;
let showToolTips;   //ToolTip will be shown based on this




const selectValue_span = document.querySelector('.selectValue_span');






/************************Popup Menu for "FilterBy"**************************/

//Unordered lists which will be passed into tippyJS
const ul_categories = document.createElement('ul');
const ul_brands = document.createElement('ul');

ul_categories.setAttribute("tabIndex", "0");
ul_brands.setAttribute("tabIndex", "0");


// Dynamically adding list items based on categories and brands respectively
database.getAllItemCategories()
.then((Categories)=>{

  Categories.forEach((category) => {

    let newItem = document.createElement('li');
    newItem.innerHTML = category.Name;
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

})
.then(()=>{

  tippy('.tip_category', {
    content: ul_categories,
    placement: 'right-start',
    theme: 'white',
    arrow: false,
    offset: [0, 0],
    animation: 'perspective',
  })

})

database.getAllItemBrands()
.then((Brands)=>{

  Brands.forEach((brand) => {

    let newItem = document.createElement('li');
    newItem.innerText = brand.Name;
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

})
.then(()=>{

    tippy('.tip_brand', {
      content: ul_brands,
      placement: 'right-start',
      theme: 'white',
      arrow: false,
      offset: [0, 0]
    })

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



/****************Events From Main Process */
ipcRenderer.on("loadUserInfo", (e, array)=>{

  let newPromise =  new Promise((resolve, reject)=>{

        [userName, userType] = array;

        resolve();

  })
  
  newPromise.then(()=>{

        if(userType === 'Admin'){
        
        
          const store = new STORE({
              configName: 'userPrefs',
              defaults: {
                  toolTipsPref: 'show',
                  timeOutPref: '1',
              }
          });
        
          store.get("toolTipsPref")
          .then((userPrefered)=>{

              if(userPrefered === "show"){
                  showToolTips = true;
              }
              else if(userPrefered === "hide"){
                showToolTips = false;
            
              }

          })
        
          
        }

  }).then(()=>{

      if(showToolTips === true){

        setToolTips();

      }

  })

  
})
