"use strict";


/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
const { ipcRenderer } = require("electron");
import clip from 'text-clipper';
import Notifications from '../controller/Alerts/NotificationController'
import DATABASE from '../model/DATABASE';
import DOMCONTROLLER from './utilities/TableController';
const cryptoJS = require("crypto-js")
//Intitalizing DB
const database = new DATABASE();


/*********************************User Params */
let UserName, UserType;


/*********************************PROGRAM CONSTANTS********************* */

let TotalItems;
let cart = [];     // Array of store objects
let lostAccounts = [];
let itemsOnReOrderLevels = [];




//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let totalSelectedRows = 0;








/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const toolBarBtn = document.querySelector('.toolBar_btn')
let tableRows;

const contentContainer = document.querySelector(".contentContainer");
const contentCover = document.querySelector(".contentCover");
const mainBodyContent = document.querySelector('.mainBody_content');
const domCart = document.querySelector(".cart")
const mainTotal = document.querySelector(".mainTotal").querySelector(".value")
const salesMadeAmount = document.querySelector("#salesMade_amount")

//Buttons
const btnCart_sell = domCart.querySelector(".btnCart_sell")
const btnCart_clear = domCart.querySelector(".btnCart_clear")
const footerBell = document.querySelector(".footerBell");
const footerBell_notIcon = footerBell.querySelector(".footerBell_notIcon")







/***********************************OBJECTS**************/
let sellingItem = {     // Represents an instance of a store item being added to cart
}

let buffer = [];
let string = "";

let SelectedRows = [];


/*********************************EVent Listeners********************* */
window.addEventListener("load", ()=>{

    initializeStoreItems();

})



document.addEventListener("keydown", (e)=>{


    if(e.key === "" || e.key === "Control" || e.key === "Enter" || e.key === "Shift" || e.key === "Alt"){
        return
    }

    buffer.push(e.key);


    setTimeout(()=>{

        console.log(buffer);

        if(buffer.length > 0){


            buffer.forEach((char)=>{

                string = string + char

            })

            if( buffer.length >= 12){

                const tableRows = document.querySelector("tbody").querySelectorAll("tr");
                tableRows.forEach((row)=>{

                    const barcode = row.querySelector(".td_Barcode--hidden").innerText;
                    let CB = row.querySelector('.td_cb').querySelector('.selectOne');
                    

                    if(CB.checked === true){
                        SelectedRows.push(row)
                    }
                    else{

                        if(barcode === string){

                            SelectedRows.push(row)    
    
    
                        }

                    }

                   



                })

                SelectedRows.forEach((row)=>{

                    toggleRowCB(row)

                })
                

            }
            else{
                console.log(buffer.length);
            }


           

        }

        buffer = [];
        string = "";
    
    }, 500)

})






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

    //Setting updating user's last seen  
    const now = new Date();
    const lastSeen = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`

})

// btnCart_sell
btnCart_sell.addEventListener("click", checkout);

btnCart_clear.addEventListener("click", clearAllItems);

footerBell.addEventListener("click", showIssues);
footerBell.addEventListener("ReOrderLevel_Reached", function alertUserReOrderLevel(){

    console.log("evt dispatched");

    footerBell_notIcon.innerText = parseInt(footerBell_notIcon.innerText) + 1;
    footerBell_notIcon.style.opacity = "1";


})






/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */

//-----------------------------------------------------------------------------------------------
//Function to load store items
function initializeStoreItems(){

    ipcRenderer.send("sendUserParams")

    DOMCONTROLLER.showLoadingBanner("Please wait. Attempting to fetch items from database...")


    database.getTotalItems()
    .then((totalItems)=>{

        totalItems = totalItems.pop();

        TotalItems = totalItems.Total;

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
    
                            DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel, fetchedItem.Barcode,"", false, fetchedItem.CostPrice, "", true, true,"Store", false)
        
                        }
                        else
                        {
                            DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,"", false, fetchedItem.CostPrice, "", true, false,"Store", false)
                        }
    
                    }

                    if(parseInt(fetchedItem.InStock) <= parseInt(fetchedItem.ReOrderLevel)){

                        itemsOnReOrderLevels.push({
                            Name: fetchedItem.Name,
                            Brand: fetchedItem.Brand,
                            Category: fetchedItem.Category
                        })

                        const ReOrderLevel_Reached = new Event("ReOrderLevel_Reached")

                        footerBell.dispatchEvent(ReOrderLevel_Reached);    


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

            TotalItems - 2;
    
            tableRows = document.querySelector('.tableBody').querySelectorAll('.bodyRow');
    
    
            //For "tableBody"
            tableRows.forEach((row)=>{
                row.addEventListener('click',(e)=>{
                    toggleRowCB(row);
                    setSellingItemProperties(row);
                })
    
                row.addEventListener('keydown',(e)=>{
    
                    if(e.code === "Enter"){
    
                        toggleRowCB(row);
                        setSellingItemProperties(row);
    
                    }
    
                })
                
            
            })
    
    
        })
        .then(()=>{
            fetchItemsRecursive()
        })
        .catch((e)=>{
           
            if(e === "ECONNREFUSED"){
                DOMCONTROLLER.removeOldBanners();
                DOMCONTROLLER.showErrorBanner("Failed to connect to database. Please try reloading or contacting us");
            }
    
        })

    })

}

function initializeTodaySales(){

    //Placed this in a one second timeout because, it has to wait for the main thread to set the "UserName" variable first
    setTimeout(()=>{

        database.getUserTotalSaleToday(UserName)
        .then((sale)=>{

            sale = sale.pop();

            if(sale.Revenue === null || sale.Revenue === undefined){
                sale.Revenue = "0.00";
            }

            salesMadeAmount.innerText = sale.Revenue;

        })

    }, 1000)

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

                offset = offset+offset;

                storeItems.forEach((fetchedItem)=>{

                    //T his will only add items which "InStock" is greater than zero
                    if(parseInt(fetchedItem.InStock) > 0){

                        if(fetchedItem.Deleted !== 1){

                            DOMCONTROLLER.createItem(fetchedItem.Name, fetchedItem.Brand, fetchedItem.Category, fetchedItem.InStock, fetchedItem.SellingPrice, fetchedItem.Discount,fetchedItem.ReOrderLevel,fetchedItem.Barcode,"", false, fetchedItem.CostPrice, "", true, false,"Store", false)
                            .then((row)=>{    

                                
    
                                //For "tableBody"
                                row.addEventListener('click',(e)=>{
                                    toggleRowCB(row);
                                    setSellingItemProperties(row);
                                })
                    
                                row.addEventListener('keydown',(e)=>{
                    
                                    if(e.code === "Enter"){
                    
                                        toggleRowCB(row);
                                        setSellingItemProperties(row);
                    
                                    }
                    
                                })                                    
                                

                            })
                            
                        }

                        if(parseInt(fetchedItem.InStock) <= parseInt(fetchedItem.ReOrderLevel)){

                            itemsOnReOrderLevels.push({
                                Name: fetchedItem.Name,
                                Brand: fetchedItem.Brand,
                                Category: fetchedItem.Category
                            })
    
                            const ReOrderLevel_Reached = new Event("ReOrderLevel_Reached")
    
                            footerBell.dispatchEvent(ReOrderLevel_Reached);    
    
    
                        }

                    }


                 })

                fetchItemsRecursive(offset)

            }


            




        })

    }, 5000)

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

        //Item being unchecked
        let itemName =row.querySelector('.td_Names').innerText;
        let itemBrand = row.querySelector('.td_Brands').innerText;

        console.log("already checked");
        
        // cart.forEach((item)=>{


        //     let currentItemIndex;+

        //     if(item.name === itemName && item.brand === itemBrand){


        //         currentItemIndex = cart.indexOf(item);

        //         cart.splice(currentItemIndex, 1)



        //     }
        // })

        console.log(cart, "niji");


        console.log(totalSelectedRows);


        // DOMCONTROLLER.addToCart(row, cart, btnCart_sell, btnCart_clear, subtractItem)


    }
    else{
        CB.checked = true

        totalSelectedRows = totalSelectedRows +1;

        DOMCONTROLLER.addToCart(row, cart, btnCart_sell, btnCart_clear, subtractItem)

        console.log("not checked");


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

            salesMadeAmount.innerText = parseFloat(salesMadeAmount.innerText) + parseFloat(mainTotal.innerText)

            salesMadeAmount.innerText = parseFloat(salesMadeAmount.innerText);

            clearAllItems()
            Notifications.showAlert("success", "Sale successful")


            

        }

    })
    .catch((error)=>{

        Notifications.showAlert("error", "Sorry. Failed to make sale due to an unknown error")

    })

}

function clearAllItems(){

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
                    const itemSold = itemsInCart[i].querySelector(".cartItem_count").value;
                    const reOrderLevel = itemsInCart[i].querySelector(".hidden_reOrderLevel").innerText;

    
                    tableRows.forEach((row)=>{

                        let rowName = row.querySelector('.td_Name--hidden').innerText;
                        let rowBrand = row.querySelector('.td_Brand--hidden').innerText;
                        let rowCategory = row.querySelector('.td_Category--hidden').innerText;
                        let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')

                        let InStock = row.querySelector(".td_Stock");


                        if(rowName === itemName && rowBrand === itemBrand && rowCategory === itemCategory){

                                checkbox.checked = false;

                                InStock.innerText = parseInt(InStock.innerText) - parseInt(itemSold); 

                                if(parseInt(InStock.innerText) === 0){

                                    row.remove();

                                }

                                if(parseInt(InStock.innerText) <= parseInt(reOrderLevel)){

                                    itemsOnReOrderLevels.forEach((item)=>{

                                        itemsOnReOrderLevels.push(
                                            {
                                                Name: rowName,
                                                Brand: rowBrand,
                                                Category: rowCategory
                                            }
                                        );
                                            
                                        const ReOrderLevel_Reached = new Event("ReOrderLevel_Reached")

                                        footerBell.dispatchEvent(ReOrderLevel_Reached);    


                                    })

                                    

                                    

                                }



                        }

                    })
                    

                    resolve()
        
    
                })
    
                afterAnimation.then(()=>{
    
                    subtractItem(itemsInCart[i], cart)
    
    
                    itemsInCart[i].remove()

                    resolve()
        
    
    
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

        const rowName = row.querySelector(".td_Name--hidden").innerText;
        const rowBrand = row.querySelector(".td_Brand--hidden").innerText ;
        const rowCategory = row.querySelector(".td_Category--hidden").innerText ;

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


function showIssues(){

    let modalOpened = false;

    contentCover.classList.add("contentCover--shown");

    let notificationContainer = document.createElement("div");
    notificationContainer.className = "notificationsContainer modal";

    notificationContainer.innerHTML = 
    `
        <header class="notifHeader">
            <b>Notifications</b>
            <img src="../Icons/modals/close--green.svg" alt="">
        </header>

        <main class="notifications">


        </main>


    `


    contentContainer.appendChild(notificationContainer);




    //Event Listeners
    let btnClose = notificationContainer.querySelector(".notifHeader").querySelector("img");


   if(itemsOnReOrderLevels.length !== 0){

        itemsOnReOrderLevels.forEach((item)=>{

            let newNotification = document.createElement("div");
            newNotification.className = "notification general";
            newNotification.innerHTML = 
            `
                <div class="icon">
                    <img src="../Icons/modals/priority_high-white-18dp.svg" alt="">
                </div>
                <div class="main">
                    <label for="" class="title">Reorder level reached</label>
                    <label for="" class="message"><span class="userName">${clip(item.Name, 10)}</span> of brand ${clip(item.Brand, 5)} and category ${clip(item.Category, 7)} has reached its reorder level.</label>
                </div>

            `

            notificationContainer.querySelector(".notifications").appendChild(newNotification)

        })

   }
   else{

        let message = document.createElement("label");
        message.innerText = "No issues to solve yet."
        notificationContainer.querySelector(".notifications").appendChild(message)

   }

    btnClose.addEventListener("click",function removeIssuesModal(){

        btnClose.removeEventListener("click", removeIssuesModal)

        notificationContainer.remove();

        contentCover.classList.remove("contentCover--shown");

    })

    /**************Functions */
    function generateHashOf(password, userName){

        return new Promise((resolve, reject)=>{

            const encrypted = cryptoJS.AES.encrypt(password, userName).toString()

            resolve(encrypted);

        })

    }

}

//---------------------------------------Main Process Event Listeners-------------------------------------
ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [UserName, UserType] = paramsArray;

    initializeTodaySales();

})

ipcRenderer.on("ctrlS_pressed", (e)=>{

    if(cart.length > 0){

        checkout();

    }
    else{
        Notifications.showNotification("Nothing to sell")
    }

})

ipcRenderer.on("ctrlC_pressed",(e)=>{

    clearAllItems();

})

//-----------------------------------------------------------------------------------------------







