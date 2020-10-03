import tippy, {
  roundArrow
} from 'tippy.js';
import '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import tippyBundleUmd from '../../node_modules/tippy.js/dist/tippy-bundle.umd';
import '../../node_modules/tippy.js/themes/material.css'


let span = document.createElement('span');
span.innerText = 'Toggle password visibility';
span.id = 'tooltip_cb';

tippy(`.form_check`, {
  interactive: true,
  content: span,
  placement: "right",
  theme: 'tomato',
  arrow: true,
  // arrow: roundArrow,
})

tippy('#store',{
  content: 'Store Front',
  placement: "right",
  theme: 'tomato',
  arrow: true
});

tippy('#inventory',{
  content: 'Inventory',
  placement: "right",
  theme: 'tomato',
  arrow: true
});

tippy('#analytics',{
  content: 'Analytics',
  placement: "right",
  theme: 'tomato',
  arrow: true
})