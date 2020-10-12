const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];


import tippy, {
  roundArrow
} from 'tippy.js';
import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import '../../node_modules/tippy.js/themes/material.css';
import "../../node_modules/tippy.js/themes/light.css";
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/perspective.css'




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


tippy('.tip_store', {
  content: storeFront
});

tippy('.tip_inventory', {
  content: inventory
});

tippy('.tip_analytics', {
  content: analytics
})

tippy('#account', {
  content: info,
  placement: 'bottom'
})

tippy('#settings', {
  content: settings,
  placement: 'bottom'
})


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
    const wrapped =  wrapText(newItem.innerHTML)

    selectValue_span.innerHTML = wrapped;
    selectValue_span.setAttribute("value", wrapped)
  })

  ul_categories.appendChild(newItem);

});

items_in_Brands.forEach((item) => {

  let newItem = document.createElement('li');
  newItem.innerHTML = item;
  newItem.className = "selectDropdown_value";
  newItem.setAttribute("tabIndex", "0");


  ul_brands.appendChild(newItem);

  newItem.addEventListener("click", () => {
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