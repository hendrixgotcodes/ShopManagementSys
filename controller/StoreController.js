"use strict";


/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
import Notifications from '../controller/Alerts/NotificationController'
import DATABASE from '../model/DATABASE';
import STORE from '../model/STORE';
import Modal from './modals/ModalController';
import TableController from './utilities/TableController';
import UnitConverter from './utilities/UnitConverter';



/*********************************PROGRAM CONSTANTS********************* */

let cart = [];     // Array of store objects
let salesMade = 0;       //Total sold Items

//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let totalSelectedRows = 0;

let footer_tbChanged = false;

//Intitalizing DB
const database = new DATABASE();





/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const toolBarBtn = document.querySelector('.toolBar_btn')

const mainBodyContent = document.querySelector('.mainBody_content');






/***********************************OBJECTS**************/
let sellingItem = {     // Represents an instance of a store item being added to cart
}



/*********************************EVent Listeners********************* */
window.addEventListener("load", initialzeStoreItems)


tip_default.addEventListener('click',()=>{
    selectValue_span.innerHTML = "Filter By:"
    selectValue_span.setAttribute("value", "default");

    TableController.resetTable();
})

//For ToolBarBtn
toolBarBtn.addEventListener('click',(e)=>{
    e.preventDefault();

    seek(toolBarTB.value)
})



/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */

//-----------------------------------------------------------------------------------------------
//Function to load store items
function initialzeStoreItems(){

    TableController.showLoadingBanner("Please wait. Attempting to fetch items from database...")


    database.fetchItems()
    .then((fetchedItems)=>{


        //If returned array contains any store item
        if(fetchedItems.length > 0){

            //Remove loading banner
            TableController.removeOldBanners();
            
            //then add each item to the table in the DOM
            fetchedItems.forEach((fetchedItem)=>{

                if(fetchedItem.Deleted === 1){

                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, true,"Store")

                }
                else
                {
                    TableController.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, false,"Store")
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
    .then(()=>{

        const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');


        //For "tableBody"
        tableROWS.forEach((row)=>{
            row.addEventListener('click',(e)=>{
                toggleRowCB(row);
                setSellingItemProperties(row);
            })
        
        })

    })
    .catch((e)=>{
       
        if(e.message  === "Database not found"){
            TableController.removeOldBanners();
            TableController.showErrorBanner("Sorry an error occured");
        }

    })

}



//-----------------------------------------------------------------------------------------------
// Searchs for an element in the Table
function seek(variable){

    let notFound = true;

    tableROWS.forEach((row)=>{
        if(row.querySelector('.td_Names').innerText.toLowerCase() === variable.toLowerCase()){
            row.scrollIntoView({behavior: 'smooth'});

            const initBGcolor = row.style.backgroundColor;
            const initColor = row.style.color;

            row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)'
            row.style.color = "#fff"

            setTimeout(()=>{
                row.style.backgroundColor = initBGcolor;
                row.style.color = initColor;
            },3000)

            notFound = false;

            return;
        }
    })

    if(notFound === true){
        Notifications.showNotification("Item not found")
    }
}


//-----------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------
function toggleRowCB(row){

    
    //Checkbox
    let CB = row.querySelector('.td_cb').querySelector('.selectOne');



    if(CB.checked === true){

        //Unchecking checkbox in clicked
        CB.checked = false;

        //Item being unchecked
        let itemName =row.querySelector('.td_Names').innerText;
        let itemBrand = row.querySelector('.td_Brands').innerText;
        
        cart.forEach((item)=>{


            let currentItemIndex;

            if(item.name === itemName && item.brand === itemBrand){


                currentItemIndex = cart.indexOf(item);

                cart.splice(currentItemIndex, 1)



            }
        })





        if(totalSelectedRows > 0){
            totalSelectedRows = totalSelectedRows -1;
        }

    }
    else{
        CB.checked = true

        totalSelectedRows = totalSelectedRows +1;

    }
}


//-----------------------------------------------------------------------------------------------
function setSellingItemProperties(row){
    sellingItem.name = row.querySelector('.td_Names').innerText
    sellingItem.brand = row.querySelector('.td_Brands').innerText
    sellingItem.category = row.querySelector('.td_Category').innerText
    sellingItem.price = row.querySelector('.td_Price').innerText;
    sellingItem.costPrice = row.querySelector('.td_costPrice').innerText;
}

//-----------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------







