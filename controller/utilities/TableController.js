"use strict";

class TableController{

    static createItem(name, brand, category, stock, sellingPrice, functions, hasItems,costPrice="", purchased=""){

        const tableROWS = document.querySelector('tbody').querySelectorAll('tr');


        //Removing Empty Banner Before Addition of new row
        const emptyBanner = document.querySelector('.contentContainer').querySelector('.emptyBanner');

        let returnedValue = true;

        //Check if Default Banner is attached to the contentContainer
        if(emptyBanner !== null){
            emptyBanner.remove();
        }

        //Destructing functions
        let checkCB= functions[0];
        let editItem = functions[1];
        let deleteItem = functions[2];
        let showRowControls = functions[3];



        // creating new row element
        const row =  document.createElement("tr");
        
        const rowContent = 
        `
        <td class="controls">
            <div class="edit"><span>Edit</span></div>
            <div class="del"><span>Delete</span></div>
        </td>
        <td class="td_cb">
            <input disabled type="checkbox" class="selectOne" aria-placeholder="select one">
        </td>
        <td class="td_Names">${name}</td>
        <td class="td_Brands">${brand}</td>
        <td class="td_Category">${category}</td>
        <td class="td_Stock">${stock}</td>
        <td class="td_Price">${sellingPrice}</td>
        `;

        row.innerHTML = rowContent;
        row.className = "bodyRow";

        if(hasItems === true){

            tableROWS.forEach((tableRow)=>{

    
                if(tableRow.querySelector('.td_Names').innerText === row.querySelector('.td_Names').innerText){
                    document.querySelector('.tableBody').replaceChild(row, tableRow);

                    console.log('matched');

                    returnedValue = 1;

                }
                else{
                    document.querySelector(".tableBody").appendChild(row);

                    console.log('not matched');

                }
            })

        }
        else if(hasItems !== true) {

            document.querySelector(".tableBody").appendChild(row);
            returnedValue = true;
        }

        



        row.scrollIntoView(
            {behavior: 'smooth'}
        )



        /******************************Adding Event Listeners************************************************/        
        row.addEventListener("click", ()=>{
            checkCB(row);

        });

        row.querySelector(".controls").querySelector(".edit").addEventListener("click",(e)=>{

            //Prevents selection of row
            e.stopPropagation();
    
            editItem(row);
        });

        row.querySelector(".controls").querySelector(".del").addEventListener("click",(e)=>{

            //Prevents selection of row
            e.stopPropagation();
    
            deleteItem(row);
        });

        row.addEventListener("contextmenu",(e)=>{

      
            showRowControls(row)
        })

        /***************************************************************************************************/        


        const initBGcolor = row.style.backgroundColor;
        const initColor = row.style.color;

        row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)'
        row.style.color = "#fff"

        setTimeout(()=>{
            row.style.backgroundColor = initBGcolor;
            row.style.color = initColor;
        },3000)

        console.log(returnedValue, " tbC");
        return returnedValue;

    }

    /******REMOVING ITEM FROM INVENTORY*****/
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
   
   static showIsEmpty(){

        const tBody = document.querySelector('tbody');

        if(tBody.rows.length !== 0){
            return
        }

       const contentContainer = document.querySelector(".contentContainer");

       const template = 
       `
            <center>

                <img src="../img/empty.svg" />
                <span id="info">
                    Inventory Is Empty. Add New Items
                    <img src="../Icons/toolBar/btnAdd--green.svg" />
                </span>

            </center>
            
        
       `
       let emptyBanner = document.createElement('div');
       emptyBanner.className = "emptyBanner";
       emptyBanner.innerHTML = template;

       contentContainer.appendChild(emptyBanner);
   }
}


module.exports = TableController;
