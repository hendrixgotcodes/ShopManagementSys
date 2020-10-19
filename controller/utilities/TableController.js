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

    static editItem(row, name, brand, category, stock, price){
        row.querySelector('.td_Names').innerText =  name;
        row.querySelector('.td_Brands').innerText = brand;
        row.querySelector('.td_Category').innerText = category;
        row.querySelector('.td_Stock').innerText = stock;
        row.querySelector('.td_Price').innerText = price;

        return true;
    }
   
}


module.exports = TableController;
