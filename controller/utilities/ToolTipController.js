import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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