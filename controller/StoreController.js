"use strict";


/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
const { ipcRenderer } = require("electron");
import Notifications from '../controller/Alerts/NotificationController'
import DATABASE from '../model/DATABASE';
import STORE from '../model/STORE';
import Modal from './modals/ModalController';
import DOMCONTROLLER from './utilities/TableController';
import UnitConverter from './utilities/UnitConverter';



/*********************************User Params */
let UserName, UserType;


/*********************************PROGRAM CONSTANTS********************* */

let cart = [];     // Array of store objects
let salesMade = 0;       //Total sold Items

//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let totalSelectedRows = 0;


//Intitalizing DB
const database = new DATABASE();





/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const toolBarBtn = document.querySelector('.toolBar_btn')

const mainBodyContent = document.querySelector('.mainBody_content');
const domCart = document.querySelector(".cart")
const btnCart_sell = domCart.querySelector(".btnCart_sell")





/***********************************OBJECTS**************/
let sellingItem = {     // Represents an instance of a store item being added to cart
}



/*********************************EVent Listeners********************* */
window.addEventListener("load", initialzeStoreItems)


tip_default.addEventListener('click',()=>{
    selectValue_span.innerHTML = "Filter By:"
    selectValue_span.setAttribute("value", "default");

    DOMCONTROLLER.resetTable();
})

//For ToolBarBtn
toolBarBtn.addEventListener('click',(e)=>{
    e.preventDefault();

    seek(toolBarTB.value)
})

//Sets user parameters
ipcRenderer.on("setUserParams", (e, userParamsArray)=>{


    [UserName, UserType] = userParamsArray

    let windowTitile = document.querySelector(".titleBar_userName");
    windowTitile.innerText = UserName

})

// btnCart_sell
btnCart_sell.addEventListener("click", checkout)



/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */

//-----------------------------------------------------------------------------------------------
//Function to load store items
function initialzeStoreItems(){

    ipcRenderer.send("sendUserParams")

    DOMCONTROLLER.showLoadingBanner("Please wait. Attempting to fetch items from database...")


    database.fetchItems()
    .then((fetchedItems)=>{


        //If returned array contains any store item
        if(fetchedItems.length > 0){

            //Remove loading banner
            DOMCONTROLLER.removeOldBanners();
            
            //then add each item to the table in the DOM
            fetchedItems.forEach((fetchedItem)=>{

                if(fetchedItem.Deleted === 1){

                    DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, true,"Store", false)

                }
                else
                {
                    DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, false,"Store", false)
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
            DOMCONTROLLER.removeOldBanners();
            DOMCONTROLLER.showErrorBanner("Sorry an error occured");
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

        DOMCONTROLLER.addToCart(row, cart, salesMade, UserName, btnCart_sell)


    }
    else{
        CB.checked = true

        totalSelectedRows = totalSelectedRows +1;

        DOMCONTROLLER.addToCart(row, cart, salesMade, UserName, btnCart_sell)


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


function checkout(){

    database.makeSale(cart, UserName)
    .then((result)=>{

        if(result === true){

            Notifications.showAlert("success", "Sale successful")

        }

    })
    .catch(()=>{

        Notifications.showAlert("error", "Sorry. Failed to make sale due to an unknown error")

    })

}

//-----------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------







