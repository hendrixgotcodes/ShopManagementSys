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
let tableRows;

const mainBodyContent = document.querySelector('.mainBody_content');
const domCart = document.querySelector(".cart")

//Buttons
const btnCart_sell = domCart.querySelector(".btnCart_sell")
const btnCart_clear = domCart.querySelector(".btnCart_clear")






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
// ipcRenderer.on("setUserParams", (e, userParamsArray)=>{


//     [UserName, UserType] = userParamsArray

//     let windowTitile = document.querySelector(".titleBar_userName");
//     windowTitile.innerText = UserName

//     //Setting updating user's last seen  
//     const now = new Date();
//     const lastSeen = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`


//     database.setUserLastSeen(UserName, lastSeen)
//     .then((result)=>{
//         console.log(result);
//     })

// })

// btnCart_sell
btnCart_sell.addEventListener("click", checkout)

btnCart_clear.addEventListener("click", clearAllItems)




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

                //T his will only add items which "InStock" is greater than zero
                if(parseInt(fetchedItem.InStock) > 0){

                    if(fetchedItem.Deleted === 1){

                        DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, true,"Store", false)
    
                    }
                    else
                    {
                        DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,"", false, fetchedItem.CostPrice, "", true, false,"Store", false)
                    }

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

        tableRows = document.querySelector('.tableBody').querySelectorAll('.bodyRow');


        //For "tableBody"
        tableRows.forEach((row)=>{
            row.addEventListener('click',(e)=>{
                toggleRowCB(row);
                setSellingItemProperties(row);
            })
        
        })

    })
    .catch((e)=>{
       
        if(e === "ECONNREFUSED"){
            DOMCONTROLLER.removeOldBanners();
            DOMCONTROLLER.showErrorBanner("Failed to connect to database. Please try reloading or contacting us");
        }

    })

}



//-----------------------------------------------------------------------------------------------
// Searchs for an element in the Table
function seek(variable){

    let notFound = true;

    tableRows.forEach((row)=>{
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

        DOMCONTROLLER.addToCart(row, cart, btnCart_sell, btnCart_clear, subtractItem)


    }
    else{
        CB.checked = true

        totalSelectedRows = totalSelectedRows +1;

        DOMCONTROLLER.addToCart(row, cart, btnCart_sell, btnCart_clear, subtractItem)


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

            clearAllItems()
            Notifications.showAlert("success", "Sale successful")


            

        }

    })
    .catch((error)=>{

        Notifications.showAlert("error", "Sorry. Failed to make sale due to an unknown error")

    })

}

function clearAllItems(afterSale){

   /** 
    * Since this function "clearAllItems", can be called after a sale or just to clear the cart the afterSale boolean is there to indicate which situation 
    * the function is being used. If it is after a sale,     
    */


        const itemsInCart = domCart.querySelectorAll(".cartItem");
        const allAnimationsDone = []


        //disbling cart buttons
        btnCart_clear.disabled = true;
        btnCart_sell.disabled = true;

        for(let i = itemsInCart.length-1; i >=0; i--){

            allAnimationsDone.push(new Promise((resolve, reject)=>{
    
                const afterAnimation = new Promise((resolve, reject)=>{
    
                    const itemName = itemsInCart[i].querySelector(".hidden_itemName").innerText;
                    const itemBrand = itemsInCart[i].querySelector(".hidden_itemBrand").innerText;
                    const itemCategory = itemsInCart[i].querySelector(".hidden_itemCategory").innerText;
    
    
                    setTimeout(()=>{
    
    
                        tableRows.forEach((row)=>{
    
                            let rowName = row.querySelector('.td_Names').innerText;
                            let rowBrand = row.querySelector('.td_Brands').innerText
                            let rowCategory = row.querySelector('.td_Category').innerText
                            let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')
    
    
                            if(rowName === itemName && rowBrand === itemBrand && rowCategory === itemCategory){
                                    checkbox.checked = false;
                            }
    
                        })
                        
    
                        itemsInCart[i].classList.remove("cartItem--shown");
    
                        resolve()
        
                    }, (i*400))
    
                })
    
                afterAnimation.then(()=>{
    
                    subtractItem(itemsInCart[i], cart)
    
                    setTimeout(()=>{
    
                        itemsInCart[i].remove()
    
                        resolve()
        
                    }, (i*500))
    
    
                })
    
            }))
    
        }

        Promise.all(allAnimationsDone)
        .then(()=>{

            domCart.querySelector(".cartInfo").style.display = "block"

        })




}

function subtractItem(item, inCart=""){

    let rowItemPrice;
    const subTotal = domCart.querySelector(".subTotal").querySelector(".value")
    const mainTotal = domCart.querySelector(".mainTotal").querySelector(".value")

    let itemName = item.querySelector(".hidden_itemName").innerText
    let itemBrand = item.querySelector(".hidden_itemBrand").innerText;
    let itemCategory = item.querySelector(".hidden_itemCategory").innerText;

    let itemQuanity = parseInt(item.querySelector(".cartItem_count").value)
    let itemTotalCost ;

    let initSubTotal = parseFloat(subTotal.innerText)


    tableRows.forEach((row)=>{

        const rowName = row.querySelector(".td_Names").innerText;
        const rowBrand = row.querySelector(".td_Brands").innerText ;
        const rowCategory = row.querySelector(".td_Category").innerText ;

        if( rowName=== itemName && rowBrand=== itemBrand && rowCategory=== itemCategory)
        {
            rowItemPrice = row.querySelector(".td_Price").innerText;

            // row.querySelector(".selectOne").checked = false

            rowItemPrice = row.querySelector(".td_Price").innerText

            itemTotalCost = itemQuanity * parseFloat(rowItemPrice)

            //Update stock in dom
            const rowStock = row.querySelector(".td_Stock");
            
            // inCart.forEach((item)=>{

            //     if(item.Item.Name === rowName && item.Item.Ro)

            // })

        }

    })


    if(initSubTotal > 0){

        subTotal.innerText = parseFloat(subTotal.innerText) - itemTotalCost;
        mainTotal.innerText = subTotal.innerText        

    }

   cart.splice(cart.findIndex(item=> item.Item.Name === itemName), 1)


}

//-----------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------







