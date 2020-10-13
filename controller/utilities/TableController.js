"use strict";

class TableController{

    static removeItem (itemName){


        itemName = itemName.toLowerCase();


        const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

        tableROWS.forEach((row)=>{
              const item =   row.querySelector(".td_Names");
              if(item !== null && item.innerText.toLowerCase() === itemName){

                row.style.transition = ".7s"
                row.style.transform = "translateX(150%)"

                 setTimeout(()=>{
                    row.remove()
                 }, 500)

              }
        })
            
    }
   
}


module.exports = TableController;
