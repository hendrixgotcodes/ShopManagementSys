// import * as tippy from '../../node_modules/tippy.js/dist/tippy.esm'

const span = document.createElement('span');
span.innerText = 'Toggle password visibility';
span.id = 'tooltip_cb';

tippy(".form_check", {
  interactive: true,
  content: span,
  placement: "right",
//   arrow: roundArrow,
    theme: 'material'

})
