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



//Right Click event lister for each row
tableROWS.forEach((row)=>{
    row.addEventListener("contextmenu",(e)=>{

      
            showRowControls(row)
    })
})


//.del button in "Control" box of every row
tableROWS.forEach((row)=>{
    row.querySelector(".controls").querySelector(".del").addEventListener("click",(e)=>{

        //Prevents selection of row
        e.stopPropagation();

        deleteItem(row);
    });
})


//.edit button in "Control" box of every row
tableROWS.forEach((row)=>{
    row.querySelector(".controls").querySelector(".edit").addEventListener("click",(e)=>{

        //Prevents selection of row
        e.stopPropagation();

        editItem(row);
    });
})



//
tableROWS.forEach((row)=>{

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

    TableController.showLoadingBanner("Please wait. Attempting to load items in inventory...")

    database.fetchItems()
    .then((fetchedItems)=>{


        //If returned array contains any store item
        if(fetchedItems.length > 0){

            //Remove loading banner
            TableController.removeOldBanners();
            
            //then add each item to the table in the DOM
            fetchedItems.forEach((fetchedItem)=>{

                if(fetchedItem.Deleted === "true"){

                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.Stock, fetchedItem.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true, true, "Inventory")

                }
                else{

                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.Stock, fetchedItem.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true,false , "Inventory")

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
        console.log(e);
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
function deleteItem(row){

    const itemName = row.querySelector(".td_Names").innerText;
    const itemBrand = row.querySelector(".td_Brands").innerText
    const itemQuantity = row.querySelector(".td_Stock").innerText;
    const itemCategory = row.querySelector(".td_Category").innerText;

    // Opens a confirmation dialog box which returns a promise
    Modal.openConfirmationBox(itemName, itemBrand, itemQuantity)
    .then((result)=>{

        if(result === "verified"){
           

            database.softDeleteItem( {
                Name: itemName,
                Brand: itemBrand,
                Category: itemCategory,
            })
            .then(()=>{

                TableController.removeItem(itemName, itemBrand)

                Notifications.showAlert("warning", `${itemName} Of Quantity ${itemQuantity} Has Been Removed From Database`)

            })

           

        }

    })
    .catch((error)=>
    {
        if(error.message === "wrongPassword"){
            Notifications.showAlert("error", `Incorrect Password, ${itemName} Not Deleted`);
        }
    })

}


//---------------------------------------------------------------------------------------------------------------
//Function does not atually edit row(inventoryItem) but rather triggers the process and determines the result of the process through a promise.
//And decide to show or not show an alert based on that result - (Used by event listeners on row ".edit" buttons in Inventory)
function editItem(row){

    const itemName = row.querySelector(".td_Names").innerText;

    Modal.openItemForm(row, true)
    .then((result)=>{

        if(result[0] === "edited"){

           
            let row, name, brand, category, stock, price;

            let promisedRow = result[1];


            [,row, name, brand, category, stock, price] = promisedRow;

            price = UnitConverter.convert(price);

            let editedInventory = new Promise(
                (resolve, reject)=>{
                   let done =  TableController.editItem(row, name, brand, category, stock, price);

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

                    TableController.createItem(storeObject.Name, storeObject.Brand, storeObject.Category, storeObject.Stock, storeObject.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], false, storeObject.CostPrice, "")
                    .then(()=>{
    
                        Notifications.showAlert("success", "Successfuly added to inventory")
    
                    })

                }

              
            })
            .catch((error)=>{
                console.log(error);
            })


    })
    .catch(
        (error)=>{

            if(error.message === "wrongPassword"){
                    Notifications.showAlert("error", "Sorry, Incorrect Password");    
            }

        }
    );

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


           let [,row, name, brand, category, stock, price] = promisedRow;

            console.log(row, name, brand, category, stock, price);

            let editedInventory = new Promise(
                (resolve, reject)=>{
                   let done =  TableController.editItem(row, name, brand, category, stock, Number.parseFloat(price));

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
            Modal.openPrompt("", resolve, reject, true, `You Are About To Delete ${rowBucket.length} Items From Inventory.
            Enter Password To Confirm.`)
        }

    )
    .then(
        (result)=>{

            let totalSelectedItems = rowBucket.length;
            
            if(result === "verified"){
                rowBucket.forEach((item)=>{

                    const itemName = item.querySelector(".td_Names").innerText;
                    const itemBrand = item.querySelector(".td_Brands").innerText;


                    TableController.removeItem(itemName, itemBrand)

                })

                rowBucket = [];

                Notifications.showAlert("warning", `[${totalSelectedItems}] Items Have Been Removed From Inventory`)

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

                TableController.createItem(item.Name, item.Brand, item.Category, item.Stock, item.SellingPrice, [checkCB, editItem, deleteItem, showRowControls], "", item.CostPrice, "", false, false)

            })

            Notifications.showAlert("success", `${resolved[1].length} Items Have Been Successfully Added. ${resolved[0].length} Items Already Existed In Database`)


        })

})
