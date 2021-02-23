"use strict";


import { ipcRenderer } from 'electron';
/************IMPORT******/
import Modal from '../controller/modals/ModalController';
import Notifications, { showNotification } from './Alerts/NotificationController';
import DOMCONTROLLER from './utilities/TableController';

//Importing ItemDB operations
import DATABASE from '../model/DATABASE.js';

// const Modal = require('../controller/modals/ModalController')

/************DOM ELEMENTS************/
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_add')

const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

const btnEdit =  document.querySelector(".btn_edit");
const btnDelete =  document.querySelector(".btn_delete");
const checkBtn = document.querySelector(".checkBtn");
const btnDropDown = document.querySelector(".btn_dropDown");

/**********USER PARAMS */
let UserName;
let UserType;



const listItemForm = document.querySelector(".dd_listItem--form");

let rowBucket = [];
let barcodeBuffer = [];
let barcode = "";


//Initializing Database
const database = new DATABASE()



/************Initializers************/
initialzeStoreItems();

/**********************EVENT LISTENERS *************************/
checkBtn.addEventListener('mouseover',toggleTBbtn_white)
checkBtn.addEventListener('mouseleave',toggleTBbtn_default)
checkBtn.addEventListener("click", toggleDropDown)



document.addEventListener("keydown", (e)=>{


    if(e.key === "" || e.key === "Control" || e.key === "Enter" || e.key === "Shift" || e.key === "Alt"){
        return
    }

    barcodeBuffer.push(e.key);


    setTimeout(()=>{


        if(barcodeBuffer.length >= 10){


            barcodeBuffer.forEach((char)=>{

                barcode = barcode + char

            })

            if(barcode.length >= 10){


                const tableRows = document.querySelector("tbody").querySelectorAll("tr");
                tableRows.forEach((row)=>{

                    const itemBarcode = row.querySelector(".td_Barcode--hidden").innerText;
                    let CB = row.querySelector('.td_cb').querySelector('.selectOne');
                    

                    

                        if(itemBarcode === barcode){

                            // rowBucket.push(row) 
                            
                            checkCB(row)
    
    
                        }       
                        else{
                                // addItem(barcode)
                        }             



                })
    
                

            }

            barcodeBuffer = [];
            barcode = "";

        }

        
    
    }, 500)

})





tableROWS.forEach((row)=>{

    //Right Click event lister for each row
    row.addEventListener("contextmenu",(e)=>{

      
        toggleRowControls(row)
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

            const fragment = document.createElement("div");
            DOMCONTROLLER.removeOldBanners();

            //Remove loading banner
            fetchedItems.forEach((fetchedItem)=>{            
            //then add each item to the table in the DOM

                
                if(fetchedItem.Deleted === 1){

                    DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,[checkCB, editItem, deleteItem, toggleRowControls], false, fetchedItem.CostPrice, "", true, true, "Inventory", false, false)
                    .then((row)=>{

                        fragment.appendChild(row)

                    })

                    }
                    else{

                        DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,[checkCB, editItem, deleteItem, toggleRowControls], false, fetchedItem.CostPrice, "", true,false , "Inventory", false)
                        .then((row)=>{

                            fragment.appendChild(row);

                        })

                    }

            })

            document.querySelector(".tableBody").appendChild(fragment);   

        }
        else{

                //Remove loading banner
                DOMCONTROLLER.removeOldBanners();

                // Show isEmpty banner
                DOMCONTROLLER.showIsEmpty();

        }

    })
    .then(()=>{

        fetchItemsRecursive();

    })
    .catch((e)=>{

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
function toggleRowControls(row){
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

            const itemName = row.querySelector(".td_Name--hidden").innerText;
            const itemBrand = row.querySelector(".td_Brand--hidden").innerText
            const itemQuantity = row.querySelector(".td_Stock").innerText;
            const itemCategory = row.querySelector(".td_Category--hidden").innerText;


                
           if(action === "delete"){

                // Opens a confirmation dialog box which returns a promise
                Modal.openConfirmationBox(itemName, itemQuantity, "delete", )
                .then((resolved)=>{   
                    

                    if(resolved === "confirmed"){

                        database.deleteItem( 
                            itemName,
                            itemBrand,
                            itemCategory,
                        )
                        .then(()=>{

                            row.remove();

                            Notifications.showAlert("warning", `${itemName} has been deleted successfully`)


                        })
                        .catch((e)=>{
                            Notifications.showAlert("error", `Sorry, failed to delete ${itemName}` )
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

    toggleRowControls(row)

    Modal.openItemForm(row, true)
    .then((result)=>{


        if(result[0] === true){


            let [,row, name, brand, category, stock, sellingPrice, costPrice, discount, reorderLevel, barcode] = result;

           


            let values = 
                {
                    Name: name,
                    Brand: brand,
                    Category: category,
                    InStock: stock,
                    CostPrice: parseFloat(costPrice),
                    SellingPrice: parseFloat(sellingPrice),
                    Discount: parseFloat(discount),
                    ReOrderLevel: parseInt(reorderLevel),
                    Barcode: barcode
                };

            


    
            database.updateItem(values, UserName)
             .then((result)=>{


                if(result === true){

                    Notifications.showAlert("success", `${name} has been successfully updated.`)

                    
                    DOMCONTROLLER.updateItem(row, name, brand, category, stock, parseFloat(sellingPrice), parseFloat(costPrice), discount, reorderLevel, barcode)
                    

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

        throw error

        if(error.message === "wrongPassword")
        Notifications.showAlert("error", "Sorry, Incorrect Password!")
    })

    

}


function addItem(barcode=""){

    if(checkBtn.checked === true){
        btnDropDown.hidden = true;
        checkBtn.checked === false;
    }


    Modal.openItemForm("", false, barcode)
    .then((result)=>{

        if(result === null){
            return;
        }

           
            // let row, name, brand, category, stock, sellingPrice, costPrice;

            let promisedRow = result;


            let [addNew,row, name, brand, category, stock, sellingPrice, costPrice, discount, reorderLevel, barcode] = promisedRow;

            //Creating a store object to be added to database
            const storeObject = new Object();
            storeObject.Name = name;
            storeObject.Brand = brand;
            storeObject.Category = category;
            storeObject.Stock = stock;
            storeObject.SellingPrice = sellingPrice;
            storeObject.CostPrice = costPrice;
            storeObject.Discount = discount;
            storeObject.ReOrderLevel = reorderLevel
            storeObject.Barcode = barcode;

            // console.log([row, name, brand, category, stock, sellingPrice, costPrice]);

           

                
            database.addNewItem(storeObject, UserName)
            .then((result)=>{

                if(result === true){

                    DOMCONTROLLER.createItem(storeObject.Name, storeObject.Brand, storeObject.Category, storeObject.Stock, storeObject.SellingPrice, storeObject.Discount,reorderLevel,barcode,[checkCB, editItem, deleteItem, toggleRowControls], false, storeObject.CostPrice, "", false, false, "inventory")
                    // DOMCONTROLLER.createItem(result.Name, result.Brand, result.Category, result.Stock, result.sellingPrice, result.Discount, result.ReOrderLevel, [checkCB,editItem, deleteItem, showRowControls], false, result.CostPrice, "", false, false, "inventory")

                    
            
                    Notifications.showAlert("success", "Successfuly added to inventory")


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

    let itemName = currentRow.querySelector(".td_Name--hidden").innerText;

    toggleRowControls(currentRow)

    Modal.openItemForm(currentRow, true)
    .then((result)=>{

        if(result[0] === true){

           let [,row, name, brand, category, stock, price, costPrice,discount, reorderLevel, barcode] = result;

           let change = {

                Name: name,
                Brand: brand,
                Category: category,
                InStock: stock,
                Discount: discount,
                SellingPrice: price,
                CostPrice: costPrice,
                ReOrderLevel: reorderLevel,
                Barcode: barcode

           }

           database.updateItem(change, UserName)
           .then(()=>{

                DOMCONTROLLER.updateItem(currentRow,name, brand, category, price, costPrice, stock,discount, reorderLevel, barcode);

                Notifications.showAlert("success", `Changes to ${itemName} have been saved successfully`);

           })
           .then(()=>{

                currentRow.querySelector(".td_cb").querySelector(".selectOne").checked = false;

                if(rowBucket.length === 0 ){

                    btnEdit.disabled = true;
                    btnDelete.disabled = true  
            
                }
                else{
                    editMultiple();
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



            // let editedInventory = new Promise(
            //     (resolve, reject)=>{
            //        let done =  DOMCONTROLLER.editItem(row, name, brand, category, stock, Number.parseFloat(price), parseFloat(costPrice) );

            //        if(done){
            //            resolve(name);
            //        }
            //        else{
            //            reject(new Error("Sorry, An Error Occured"));
            //        }
            //     }
            // );




               


                
            
            // .catch(
            //     (error)=>{
            //         Notifications.showAlert("error", error);
            //     }
            // );


           
        }

     

    }).catch((error)=>{

        if(error.message=== "wrongPassword"){
            Notifications.showAlert("error", "Sorry, Incorrect Password!")
        }
    })

  


}


//Function called on btnDelete Event
function deleteMultiple(){

   
    Modal.openConfirmationBox("", "", "", `Do you wish to delete ${rowBucket.length} items from inventory? `)
    .then(
        (result)=>{


            const promises = [];

            
            if(result === "confirmed"){
                rowBucket.forEach((row)=>{

                    promises.push(new Promise((resolve, reject)=>{

                        const itemName = row.querySelector(".td_Name--hidden").innerText;
                        const itemBrand = row.querySelector(".td_Brand--hidden").innerText
                        const itemCategory = row.querySelector(".td_Category--hidden").innerText;

                        database.deleteItem( 
                            itemName,
                            itemBrand,
                            itemCategory,
                        )
                        .then(()=>{

                            row.remove();
                            resolve();

                        })
                        .catch((e)=>{
                            reject();
                        })

                    }))

                   

                })

                Promise.all(promises)
                .then(()=>{

                    Notifications.showAlert("warning", `${rowBucket.length} items have been deleted successfully`);

                    rowBucket = [];

                    btnDelete.disabled = true;
                    btnEdit.disabled = true;

                    if(tableROWS.length === 0){

                        DOMCONTROLLER.showIsEmpty();

                    }

                })
                .catch(()=>{

                    Notifications.showAlert("warning", `Sorry. Failed to delete all ${rowBucket.length}`)

                })


            }
        }
    )

}

function fetchItemsRecursive(offset = 200){


    let timeOutId = setTimeout(()=>{


        database.paginateRemainingItems(offset)
        .then((storeItems)=>{


            if(storeItems.length === 0){
                clearTimeout(timeOutId)
                return
            }
            else{

                offset = offset + offset;

                const fragment = document.createElement("div");

                storeItems.forEach((fetchedItem)=>{

                    if(parseInt(fetchedItem.InStock) > 0){

                        if(fetchedItem.Deleted === 1){

                            DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,[checkCB, editItem, deleteItem, toggleRowControls], false, fetchedItem.CostPrice, "", true, true, "Inventory", false, false)
                            .then((row)=>{

                                row.addEventListener("click", ()=>{

                                    checkCB(row)

                                });

                                row.querySelector(".controls").querySelector(".edit").addEventListener("click",(e)=>{

                                    e.stopPropagation();

                                    editItem(row)

                                })

                                row.querySelector(".controls").querySelector(".del").addEventListener("click",(e)=>{

                                    e.stopPropagation();

                                    const rowState = row.querySelector(".state").innerText;

                                    if(rowState === "visible"){
                            
                                        deleteItem(row);
                            
                                    }
                                    else if(rowState === "deleted"){
                            
                                        deleteItem(row, "recover");
                                        
                                    }

                                });

                                row.addEventListener("contextmenu",toggleRowControls);   

                                fragment.appendChild(row)

                            })
        
                        }
                        else{
        
                            DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,[checkCB, editItem, deleteItem, toggleRowControls], false, fetchedItem.CostPrice, "", true,false , "Inventory", false, false)
                            .then((row)=>{

                                row.addEventListener("click", ()=>{

                                    checkCB(row)

                                });

                                row.querySelector(".controls").querySelector(".edit").addEventListener("click",()=>{

                                    editItem(row)

                                })

                                row.querySelector(".controls").querySelector(".del").addEventListener("click",()=>{

                                    const rowState = row.querySelector(".state").innerText;

                                    if(rowState === "visible"){
                            
                                        deleteItem(row);
                            
                                    }
                                    else if(rowState === "deleted"){
                            
                                        deleteItem(row, "recover");
                                        
                                    }

                                });

                                row.addEventListener("contextmenu", ()=>{

                                    toggleRowControls(row)

                                });   

                                fragment.appendChild(row)

                            })
        
                        }

                    }


                 })

                 document.querySelector("tbody").appendChild(fragment);

                fetchItemsRecursive(offset)

            }


            




        })

    }, 5000)

}





/*********************EVENT LISTENERS FROM MAIN*******************/

//Responds to event triggered by the main process when store items are added by excel sheet
ipcRenderer.on('populateTable',(e, Items)=>{

        const itemsArray = [];

        //Renaming Object Keys
        Items.forEach((item)=>{

            let newArray = Object.values(item);


            let [name, brand, category, stock, costPrice, sellingPrice, discount, reOrderLevel, barcode] = newArray;


            itemsArray.push({
                Name: name,
                Brand: brand,
                Category: category,
                InStock: stock,
                SellingPrice: sellingPrice,
                CostPrice: costPrice,
                Discount: discount,
                Deleted : "false",
                ReOrderLevel: reOrderLevel,
                Barcode: barcode
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


           if(notInDb > 0 && inDb.length > 0){

                Notifications.showAlert("success", `${notInDb} Items Have Been Successfully Added. ${inDb.length} existed in database.`)

                inDb.forEach((item)=>{

                    DOMCONTROLLER.updateStock(item.Name, item.Brand, item.Category, item.InStock)

                })

           }
           else if(notInDb.length === 0 && inDb.length > 0){

                Notifications.showAlert("success", `${inDb.length} have been successfully updated`)

                inDb.forEach((item)=>{

                    DOMCONTROLLER.updateStock(item.Name, item.Brand, item.Category, item.InStock)

                })


           }
           else if(notInDb.length > 0 && inDb.length === 0){

                Notifications.showAlert("success", `${notInDb.length} items have been successfully added`)

                notInDb.forEach((item)=>{

                    DOMCONTROLLER.createItem(item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.Discount,item.ReOrderLevel,item.Barcode,[checkCB, editItem, deleteItem, toggleRowControls], "", item.CostPrice, "", false, false, "Inventory")

                })



            }

        })
        .catch((error)=>{
            Notifications.showAlert("error", "Sorry an error occured")
        })

})
