"use strict"
const tippy = require('tippy.js').default;
// import 'tippy.js/themes/light.css'


class ToolTipsController{

    static generateToolTip(elementId, content){

        tippy(`#${elementId}`,
        {
            content: content,
            delay: 100,
            // theme: 'light'
        })

    }

}

module.exports = ToolTipsController;