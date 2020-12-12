"use strict"

import tippy from 'tippy.js'




class ToolTipsController{

    static generateToolTip(elementId, content){

        let newToolTip = tippy(`#${elementId}`,
        {
            content: content
            // delay: 300,
            // theme: 'light'
        })

        console.log(newToolTip);

        return newToolTip;


    }

}

module.exports = ToolTipsController;