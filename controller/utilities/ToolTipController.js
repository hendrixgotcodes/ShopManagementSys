import tippy, {
  roundArrow
} from 'tippy.js';
import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import '../../node_modules/tippy.js/themes/material.css'


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

let account = document.createElement('span');
account.innerText = 'Account Settings';
account.className = 'tooltip_cb';

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
  content: account,
  placement: 'bottom'
})

tippy('#settings', {
  content: settings,
  placement: 'bottom'
})


//"FilterBy" DropDown Menu
const ul_categories = document.createElement('ul');
itemCategories.forEach((item)=>{

  let newItem = document.createElement('li');
  newItem.innerHTML = item;
  
  ul_categories.appendChild(newItem);

})