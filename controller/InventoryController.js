"use strict";


import { ipcRenderer } from 'electron';
/************IMPORT******/
import Modal from '../controller/modals/ModalController';
import Notifications from './Alerts/NotificationController';
import TableController from './utilities/TableController';
import UnitConverter from './utilities/UnitConverter';

//Importing ItemDB operations
import DATABASE from '../model/DATABASE.js';

// const Modal = require('../controller/modals/ModalController')

/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_add')

const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

const btnAdd = document.querySelector(".btn_add");
const btnEdit =  document.querySelector(".btn_edit");
const btnDelete =  document.querySelector(".btn_delete");
const checkBtn = document.querySelector(".checkBtn");
const btnDropDown = document.querySelector(".btn_dropDown");

const listItemForm = document.querySelector(".dd_listItem--form");

let rowBucket = [];

//Initializing Database
const database = new DATABASE()




/**********************EVENT LISTENERS *************************/
window.addEventListener("load", initialzeStoreItems)

checkBtn.addEventListener('mouseover',toggleTBbtn_white)
checkBtn.addEventListener('mouseleave',toggleTBbtn_default)
checkBtn.addEventListener("click", toggleDropDown)





tableROWS.forEach((row)=>{

    //Right Click event lister for each row
    row.addEventListener("contextmenu",(e)=>{

      
        showRowControls(row)
    })

    //.del button in "Control" box of every row
    row.querySelector(".controls").querySelector(".del").addEventListener("click",(e)=>{

        //Prevents selection of row
        e.stopPropagation();

        const rowState = row.querySelector(".state").innerText;

        if(rowState === "visible"){

            deleteItem(row);

        }
        else if(rowState === "deleted"){

            deleteItem(row, "recover");
            
        }
    });

    //.edit button in "Control" box of every row
    row.querySelector(".controls").querySelector(".edit").addEventListener("click",(e)=>{

        //Prevents selection of row
        e.stopPropagation();

        editItem(row);
    });


    row.addEventListener("click", ()=>{
        checkCB(row);
    });

})




//For btnAdd(Add button in Inventory toolbar)
listItemForm.addEventListener("click",addItem)


//For btnEdit (Edit button in Inventory )
btnEdit.addEventListener("click", editMultiple)

//For btnDelete (Delete button in Inventory)
btnDelete.addEventListener("click", deleteMultiple)






/*****************************************************FUNCTIONS***************************************************/

//Function to load store items
function initialzeStoreItems(){

    TableController.showLoadingBanner("Please wait. Attempting to load items in database...")

    database.fetchItems()
    .then((fetchedItems)=>{


        //If returned array contains any store item
        if(fetchedItems.length > 0){

            //Remove loading banner
            TableController.removeOldBanners();
            
            //then add each item to the table in the DOM
            fetchedItems.forEach((fetchedItem)=>{

                if(fetchedItem.Deleted === 1){

                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true, true, "Inventory")

                }
                else{

                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true,false , "Inventory")

                }

            })
            

        }
        else{

                //Remove loading banner
                TableController.removeOldBanners();

                // Show isEmpty banner
                TableController.showIsEmpty();

        }

    })
    .catch((e)=>{

        if(e.message === "Database not found"){

            TableController.removeOldBanners();
            TableController.showErrorBanner("Sorry an error occured");

        }


        
    })

}


//---------------------------------------------------------------------------------------------------------------
// Two functions responsible for changing the icon in the "Add button" in the Inventory toolbar
function toggleTBbtn_white(){
    toolBar_btn.style.backgroundColor = ' #35594B';
    toolBar_btn.style.color = '#fff';
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd.svg')
}

function toggleTBbtn_default(){
    toolBar_btn.style.backgroundColor = ' #fff';
    toolBar_btn.style.color = '#35594B';
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd--green.svg')
}


function toggleDropDown(){
    
    if(checkBtn.checked === true){
        btnDropDown.hidden = false;
        btnDropDown.focus();
    }
    else if(checkBtn.checked === false){
        btnDropDown.hidden = true;

    }
}


//---------------------------------------------------------------------------------------------------------------
//Responsible for swiping table row to right - (Used by event listeners appended on each row in  Inventory)
function showRowControls(row){
    if(row.classList.contains("controlShown")){
        row.style.transform = "translateX(0px)"
        row.classList.remove("controlShown");
    }
    else{
        
        row.style.transform = "translateX(15%)"
        row.classList.add("controlShown");

    }   

}

//---------------------------------------------------------------------------------------------------------------
//Function does not atually delete row(inventoryItem) but rather triggers the process and determines the result of the process through a promise.
//And decide to show or not show an alert based on that result - (Used by event listeners on row ".del" buttons in Inventory)
function deleteItem(row, action="delete"){
    

            const itemName = row.querySelector(".td_Names").innerText;
            const itemBrand = row.querySelector(".td_Brands").innerText
            const itemQuantity = row.querySelector(".td_Stock").innerText;
            const itemCategory = row.querySelector(".td_Category").innerText;


                
           if(action === "delete"){

                // Opens a confirmation dialog box which returns a promise
                Modal.openConfirmationBox(itemName, itemQuantity, "delete")
                .then((resolved)=>{   
                    

                    if(resolved === "confirmed"){

                        database.softDeleteItem( {
                            Name: itemName,
                            Brand: itemBrand,
                            Category: itemCategory,
                        })
                        .then(()=>{

                            TableController.markAsRemove(itemName, itemBrand)

                            Notifications.showAlert("warning", `${itemName} of quantity ${itemQuantity} will no longer be visible in the shop front`)


                        })
                        .catch((e)=>{
                            Notifications.showAlert("error", `Sorry, failed to mark ${itemName} of quantity ${itemQuantity} as deleted. ${itemName} will remain visible in the shop front` )
                        })

                    }


                
                })
           }
            else if(action === "recover"){

                // Opens a confirmation dialog box which returns a promise
                Modal.openConfirmationBox(itemName, itemQuantity, "recover")
                .then((resolved)=>{   

                    if(resolved === "confirmed"){

                        database.recoverItem( {
                            Name: itemName,
                            Brand: itemBrand,
                            Category: itemCategory,
                        })
                        .then(()=>{

                            TableController.markAsVisible(itemName, itemBrand)

                            Notifications.showAlert("warning", `${itemName} of quantity ${itemQuantity} will now be visible in the shop front`)


                        })
                        .catch((e)=>{
                            Notifications.showAlert("error", `Sorry, failed to mark ${itemName} of quantity ${itemQuantity} as visible. ${itemName} will not be shown in the shop front` )
                        })

                    }

                })

            }



}


//---------------------------------------------------------------------------------------------------------------
//Function does not atually edit row(inventoryItem) but rather triggers the process and determines the result of the process through a promise.
//And decide to show or not show an alert based on that result - (Used by event listeners on row ".edit" buttons in Inventory)
function editItem(row){


    Modal.openItemForm(row, true)
    .then((result)=>{


        if(result[0] === true){


            let [,row, name, brand, category, stock, sellingPrice, costPrice] = result;

            // price = UnitConverter.convert(price);


            let values = 
                {
                    Name: name,
                    Brand: brand,
                    Category: category,
                    InStock: stock,
                    CostPrice: parseFloat(costPrice),
                    SellingPrice: parseFloat(sellingPrice),
                };

            


    
            database.updateItem(values)
             .then((result)=>{

                if(result === true){
                    
                    TableController.editItem(row, name, brand, category, stock, parseFloat(sellingPrice), parseFloat(costPrice))
                    
                    Notifications.showAlert("success", `${name} has been successfully updated.`)

                }

            })
            .catch((e)=>{

                if(e.message === "UNKNWN_ERR" ){
                    Notifications.showAlert("error", "Sorry, an unknown error occurred with the database during update")
                }
                else if(e.message == "ERR_DUP_ENTRY"){

                    Notifications.showAlert("error", `Sorry, ${values.Name} of brand ${values.Brand} in the ${values.Category} category already exists in database`)

                }

            })
            
 
        }
     

    }).catch((error)=>{
        if(error.message === "wrongPassword")
        Notifications.showAlert("error", "Sorry, Incorrect Password!")
    })

    

}


function addItem(){

    if(checkBtn.checked === true){
        btnDropDown.hidden = true;
        checkBtn.checked === false;
    }


    Modal.openItemForm("", false)
    .then((result)=>{

        if(result === null){
            return;
        }

           
            let row, name, brand, category, stock, sellingPrice, costPrice;

            let promisedRow = result;


            [,row, name, brand, category, stock, sellingPrice, costPrice] = promisedRow;

            //Creating a store object to be added to database
            const storeObject = new Object();
            storeObject.Name = name;
            storeObject.Brand = brand;
            storeObject.Category = category;
            storeObject.Stock = stock;
            storeObject.SellingPrice = sellingPrice;
            storeObject.CostPrice = costPrice;

            // console.log([row, name, brand, category, stock, sellingPrice, costPrice]);

            console.log("storeObject: ", storeObject);

            database.addNewItem(storeObject)
            .then((result)=>{

                if(result === true){

                    TableController.createItem(storeObject.Name, storeObject.Brand, storeObject.Category, storeObject.Stock, storeObject.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, storeObject.CostPrice, "", false, false, "inventory")
                    .then(()=>{
    
                        Notifications.showAlert("success", "Successfuly added to inventory")
    
                    })

                }

              
            })
            .catch((error)=>{

                if(error === "duplicate"){
                    Notifications.showAlert("error", `Sorry, failed to add ${storeObject.Name} of brand ${storeObject.Brand} to inventory. This item already exists`)
                    return;
                }

                Notifications.showAlert("error", `Sorry, failed to add ${storeObject.Name} of brand ${storeObject.Brand} to inventory. Try Again Later`)
                console.log(error);
            })


    })

}



//---------------------------------------------------------------------------------------------------------------
// Adds and removes shop items to rowBucket on checkbox tick and untick respectively
function checkCB(row){
    const CB = row.querySelector(".td_cb").querySelector(".selectOne");
   


    if(CB.checked !== true){
            rowBucket.push(row);

            btnEdit.disabled = false
            btnDelete.disabled = false

            CB.checked = true;
    }
    else{
        
        rowBucket.forEach((element)=>{

            if(element.querySelector(".td_Names").innerText === row.querySelector(".td_Names").innerText){
                  let index =  (rowBucket.indexOf(element));

                  rowBucket.splice(index,1)

                  if(rowBucket.length === 0){
                        btnEdit.disabled = true;
                        btnDelete.disabled = true  
                  }

            }

        })

        CB.checked = false
    }
}


//---------------------------------------------------------------------------------------------------------------
//

function editMultiple(){


    let currentRow = rowBucket.pop();

    let itemName = currentRow.querySelector(".td_Names").innerText;

    Modal.openItemForm(currentRow, true)
    .then((result)=>{

        if(result[0] === "edited"){

           
            // let row, name, brand, category, stock, price;

            let promisedRow = result[1];


           let [,row, name, brand, category, stock, price, costPrice] = promisedRow;


            let editedInventory = new Promise(
                (resolve, reject)=>{
                   let done =  TableController.editItem(row, name, brand, category, stock, Number.parseFloat(price), parseFloat(costPrice) );

                   if(done){
                       resolve(name);
                   }
                   else{
                       reject(new Error("Sorry, An Error Occured"));
                   }
                }
            );

            editedInventory.then(
                (name)=>{
                         Notifications.showAlert("success", `${itemName} Has Been Successfully Changed To ${name}`);
                }
            )
            // .catch(
            //     (error)=>{
            //         Notifications.showAlert("error", error);
            //     }
            // );


            currentRow.querySelector(".td_cb").querySelector(".selectOne").checked = false;

            if(rowBucket.length === 0 ){

                btnEdit.disabled = true;
                btnDelete.disabled = true  
        
              }
              else{
                  editMultiple();
              }
        }

     

    }).catch((error)=>{

        if(error.message=== "wrongPassword"){
            Notifications.showAlert("error", "Sorry, Incorrect Password!")
        }
        else{
            console.log(error);
        }
    })

  


}


//Function called on btnDelete Event
function deleteMultiple(){

    const returnedPromise = new Promise(

        (resolve, reject)=>{
            Modal.openConfirmationBox("", "", "", `${rowBucket.length} items selected. Deleted items will be recovered, `)
        }

    )
    .then(
        (result)=>{

            let totalSelectedItems = rowBucket.length;
            
            if(result === "verified"){
                rowBucket.forEach((row)=>{

                    // const itemName = item.querySelector(".td_Names").innerText;
                    // const itemBrand = item.querySelector(".td_Brands").innerText;


                    // TableController.markAsRemove(itemName, itemBrand)

                    if(row.querySelector(".state").innerText === "deleted"){

                        deleteItem(row)
                    }
                    else{
                        deleteItem(row, "recover")
                    }

                    deleteItem(row, )

                })

                rowBucket = [];

            }
        }
    )

}





/*********************EVENT LISTENERS FROM MAIN*******************/

//Responds to event triggered by the main process when store items are added by excel sheet
ipcRenderer.on('populateTable',(e, Items)=>{

        const itemsArray = [];
        //Renaming Object Keys
        Items.forEach((item)=>{

            let newArray = Object.values(item);

            let [name, brand, category, stock, sellingPrice, costPrice] = newArray;

            itemsArray.push({
                Name: name,
                Brand: brand,
                Category: category,
                Stock: stock,
                SellingPrice: sellingPrice,
                CostPrice: costPrice,
                Deleted : "false"
            })

        })

        database.addItemsBulk(itemsArray)
        .then((resolved)=>{

            resolved[1].forEach((item)=>{

                TableController.createItem(item.Name, item.Brand, item.Category, item.Stock, item.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], "", item.CostPrice, "", false, false, "Inventory")

            })

            Notifications.showAlert("success", `${resolved[1].length} Items Have Been Successfully Added. ${resolved[0].length} Items Already Existed In Database`)


        })

})
