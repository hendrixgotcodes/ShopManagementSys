"use strict";


/************IMPORT******/
import Modal from '../controller/modals/ModalController';
import Notifications from './Alerts/NotificationController';
import TableController from './utilities/TableController';
// const Modal = require('../controller/modals/ModalController')

/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_add')

const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

const btnAdd = document.querySelector(".btn_add");
const btnEdit =  document.querySelector(".btn_edit");
const btnDelete =  document.querySelector(".btn_delete");

const rowBucket = [];





/**********************EVENT LISTENERS *************************/
toolBar_btn.addEventListener('mouseover',toggleTBbtn_white)
toolBar_btn.addEventListener('mouseleave',toggleTBbtn_default)

//Right Click event lister for each row
tableROWS.forEach((row)=>{
    row.addEventListener("contextmenu",(e)=>{

      
            showRowControls(row)
    })
})


//.del button in "Control" box of every row
tableROWS.forEach((row)=>{
    row.querySelector(".controls").querySelector(".del").addEventListener("click",()=>{
        deleteItem(row);
    });
})


//.edit button in "Control" box of every row
tableROWS.forEach((row)=>{
    row.querySelector(".controls").querySelector(".edit").addEventListener("click",()=>{
        editItem(row);
    });
})



//
tableROWS.forEach((row)=>{

    // row.querySelector(".td_cb").querySelector(".selectOne").addEventListener("click", ()=>{
    //     checkCB(row);
    // });

    row.addEventListener("click", ()=>{
        checkCB(row);
    });

    // row.querySelector(".td_Names").addEventListener("click", ()=>{
    //     checkCB(row);
    // });

    // row.querySelector(".td_Brands").addEventListener("click", ()=>{
    //     checkCB(row);
    // });

    // row.querySelector(".td_Category").addEventListener("click", ()=>{
    //     checkCB(row);
    // });

    // row.querySelector(".td_Stock").addEventListener("click", ()=>{
    //     checkCB(row);
    // });

    // row.querySelector(".td_Price").addEventListener("click", ()=>{
    //     checkCB(row);
    // });
})


//For btnAdd(Add button in Inventory toolbar)
btnAdd.addEventListener("click",addItem)

//For btnEdit (Edit button in Inventory )
btnEdit.addEventListener("click", editMultiple)















/*****************************************************FUNCTIONS***************************************************/




//---------------------------------------------------------------------------------------------------------------
// Two functions responsible for changing the icon in the "Add button" in the Inventory toolbar
function toggleTBbtn_white(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd.svg')
}

function toggleTBbtn_default(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd--green.svg')
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
    const itemQuantity = row.querySelector(".td_Stock").innerText;

    // Opens a confirmation dialog box which returns a promise
    Modal.openConfirmationBox(itemName, itemQuantity)
    .then((result)=>{

        if(result === "removed"){

            Notifications.showAlert("warning", `${itemName} Of Quantity ${itemQuantity} Has Been Removed From Database`)

        }

    })
    .catch((error)=>
    {
        if(error === "wrongPassword"){
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

        if(result === "edited"){
            Notifications.showAlert("success", `${itemName} Has Been Edited Successfully`);
        }

    });

}


function addItem(){
    Modal.openItemForm("", false)
    .then((result)=>{

        if(result === "edited"){
            Notifications.showAlert("success", `${itemName} Has Been Edited Successfully`);
        }

    });
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

    // const itemName = row.querySelector(".td_Names").innerText;

    let row = rowBucket.pop();

    let itemName = row.querySelector(".td_Names").innerText;

    Modal.openItemForm(row, true)
    .then((result)=>{

        if(result === "edited"){

            TableController.removeItem(itemName);

            Notifications.showAlert("success", `${itemName} Has Been Edited Successfully`);

            if(rowBucket.length === 0 ){

                btnEdit.disabled = true;
                btnDelete.disabled = true  
        
              }
              else{
                  editMultiple();
              }
        }

     

    });

  


}