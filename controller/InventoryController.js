"use strict";


import { ipcRenderer } from 'electron';
/************IMPORT******/
import Modal from '../controller/modals/ModalController';
import Notifications from './Alerts/NotificationController';
import DOMCONTROLLER from './utilities/TableController';
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

/**********USER PARAMS */
let UserName;
let UserType;



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

//Sets the user parameters
ipcRenderer.on("setUserParams", (e, userParamsArray)=>{


    [UserName, UserType] = userParamsArray

    let windowTitile = document.querySelector(".titleBar_userName");
    windowTitile.innerText = UserName

})






/*****************************************************FUNCTIONS***************************************************/

//Function to load store items
function initialzeStoreItems(){

    //Triggers Main Renderer to send the "setUserParams" event
    ipcRenderer.send("sendUserParams")

    DOMCONTROLLER.showLoadingBanner("Please wait. Attempting to load items in database...")

    database.fetchItems()
    .then((fetchedItems)=>{


        //If returned array contains any store item
        if(fetchedItems.length > 0){

            //Remove loading banner
            DOMCONTROLLER.removeOldBanners();
            
            //then add each item to the table in the DOM
            fetchedItems.forEach((fetchedItem)=>{

                if(fetchedItem.Deleted === 1){

                    DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,[checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true, true, "Inventory", false)

                }
                else{

                    DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,[checkCB, editItem, deleteItem, showRowControls], false, fetchedItem.CostPrice, "", true,false , "Inventory", false)

                }

            })
            

        }
        else{

                //Remove loading banner
                DOMCONTROLLER.removeOldBanners();

                // Show isEmpty banner
                DOMCONTROLLER.showIsEmpty();

        }

    })
    .catch((e)=>{

        console.log("ee", e);
       
        if(e === "ECONNREFUSED"){
            DOMCONTROLLER.removeOldBanners();
            DOMCONTROLLER.showErrorBanner("Failed to connect to database. Please try reloading or contacting us");
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

                            DOMCONTROLLER.markAsRemove(itemName, itemBrand)

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

                            DOMCONTROLLER.markAsVisible(itemName, itemBrand)

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


            let [,row, name, brand, category, stock, sellingPrice, costPrice, discount] = result;

           


            let values = 
                {
                    Name: name,
                    Brand: brand,
                    Category: category,
                    InStock: stock,
                    CostPrice: parseFloat(costPrice),
                    SellingPrice: parseFloat(sellingPrice),
                    Discount: parseFloat(discount)
                };

            


    
            database.updateItem(values, UserName)
             .then((result)=>{

                console.log(result);

                if(result === true){

                    Notifications.showAlert("success", `${name} has been successfully updated.`)

                    
                    DOMCONTROLLER.editItem(row, name, brand, category, stock, parseFloat(sellingPrice), parseFloat(costPrice), parseFloat(discount))
                    

                }

            })
            .catch((e)=>{

                if(e.message === "unknown error" ){
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

           
            // let row, name, brand, category, stock, sellingPrice, costPrice;

            let promisedRow = result;


            let [,row, name, brand, category, stock, sellingPrice, costPrice, discount] = promisedRow;

            //Creating a store object to be added to database
            const storeObject = new Object();
            storeObject.Name = name;
            storeObject.Brand = brand;
            storeObject.Category = category;
            storeObject.Stock = stock;
            storeObject.SellingPrice = sellingPrice;
            storeObject.CostPrice = costPrice;
            storeObject.Discount = discount;

            // console.log([row, name, brand, category, stock, sellingPrice, costPrice]);


            database.addNewItem(storeObject, UserName)
            .then((result)=>{

                if(result === true){

                    DOMCONTROLLER.createItem(result.Name, result.Brand, result.Category, result.Stock, result.SellingPrice, result.Discount,[checkCB, editItem, deleteItem, showRowControls], false, storeObject.CostPrice, "", false, false, "inventory")
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
                else{

                    Notifications.showAlert("error", `Sorry, failed to add ${storeObject.Name} of brand ${storeObject.Brand} to inventory due to an unknown error`)

                }

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
                   let done =  DOMCONTROLLER.editItem(row, name, brand, category, stock, Number.parseFloat(price), parseFloat(costPrice) );

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
                InStock: stock,
                SellingPrice: sellingPrice,
                CostPrice: costPrice,
                Deleted : "false"
            })

        })

        database.addItemsBulk(itemsArray, UserName)
        .then((resolved)=>{

            let inDb = resolved[1];


            inDb.forEach((item)=>{

                resolved[0].forEach((item2, item2Index)=>{

                    if(item.Name === item2.Name && item.Brand === item2.Brand && item.Category === item2.Category){
                        resolved[0].splice(item2Index, 1)
                    }

                })

            })
           

            let notInDb = resolved[0]

            console.log(notInDb);


           if(notInDb > 0 && inDb.length > 0){

                Notifications.showAlert("success", `${notInDb} Items Have Been Successfully Added. ${inDb.length} existed in database.`)

                notInDb.forEach((item)=>{

                    DOMCONTROLLER.createItem(item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.Discount,[checkCB, editItem, deleteItem, showRowControls], "", item.CostPrice, "", false, false, "Inventory")

                })

                inDb.forEach((item)=>{

                    DOMCONTROLLER.editItem("", item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.CostPrice, item.Discount,)

                })

           }
           else if(notInDb.length === 0 && inDb.length > 0){

                Notifications.showAlert("success", `${inDb.length} have been successfully updated`)

                inDb.forEach((item)=>{

                    DOMCONTROLLER.editItem("", item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.CostPrice, item.Discount,)

                })


           }
           else if(notInDb.length > 0 && inDb.length === 0){

                Notifications.showAlert("success", `${notInDb.length} items have been successfully added`)

                notInDb.forEach((item)=>{

                    DOMCONTROLLER.createItem(item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.Discount,[checkCB, editItem, deleteItem, showRowControls], "", item.CostPrice, "", false, false, "Inventory")

                })



            }

        })
        .catch((error)=>{
            Notifications.showAlert("error", "Sorry an error occured")
            console.log(error);
        })

})
