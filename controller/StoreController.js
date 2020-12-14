"use strict";


/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
const { ipcRenderer } = require("electron");
import Notifications from '../controller/Alerts/NotificationController'
import DATABASE from '../model/DATABASE';
import DOMCONTROLLER from './utilities/TableController';



/*********************************User Params */
let UserName, UserType;


/*********************************PROGRAM CONSTANTS********************* */

let cart = [];     // Array of store objects
let lostAccounts = []



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







/***********************************OBJECTS**************/
let sellingItem = {     // Represents an instance of a store item being added to cart
}



/*********************************EVent Listeners********************* */
window.addEventListener("load", ()=>{

    initializeStoreItems();
    getAllIssue();
    initializeTodaySales();

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

            row.addEventListener('keydown',(e)=>{

                if(e.code === "Enter"){

                    toggleRowCB(row);
                    setSellingItemProperties(row);

                }

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

function initializeTodaySales(){

    setTimeout(()=>{

        database.getUserTotalSaleToday(UserName)
        .then((sale)=>{

            sale = sale.pop();

            salesMadeAmount.innerText = sale.Revenue;

        })

    }, 1000)

}

function fetchItemsRecursive(){

    let offset = 200;

    database.fetchItemsRecursive(offset)
    .then(([totalItemsAvailable, storeItems])=>{


        storeItems.forEach((storeItem)=>{

            //T his will only add items which "InStock" is greater than zero
            if(parseInt(storeItem.InStock) > 0){

                if(storeItem.Deleted !== 1){

                    DOMCONTROLLER.createItem(storeItem.Name, storeItem.Brand, storeItem.Category, storeItem.InStock, storeItem.SellingPrice, storeItem.Discount,"", false, storeItem.CostPrice, "", true, false,"Store", false)
                }

            }


        })

        offset = offset + 200;


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
                    const itemSold = itemsInCart[i].querySelector(".cartItem_count").value
    
    
    
    
                    tableRows.forEach((row)=>{

                        let rowName = row.querySelector('.td_Name--hidden').innerText;
                        let rowBrand = row.querySelector('.td_Brand--hidden').innerText
                        let rowCategory = row.querySelector('.td_Category--hidden').innerText
                        let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')

                        let InStock = row.querySelector(".td_Stock");


                        if(rowName === itemName && rowBrand === itemBrand && rowCategory === itemCategory){
                                checkbox.checked = false;

                                InStock.innerText = parseInt(InStock.innerText) - parseInt(itemSold); 

                                if(parseInt(InStock.innerText) === 0){

                                    row.remove();

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

function getAllIssue(){

    let issueCount = document.querySelector(".footerBell_notIcon");

    database.getReportedAccounts()
    .then((accounts)=>{

        console.log(accounts);


        if(accounts !== null || accounts !== undefined || accounts.length !== 0){

           lostAccounts = accounts

        }
            


    })
    .then(()=>{

        database.getNumberOfReportedAccount()
        .then((result)=>{

            result = result.pop();

            issueCount.innerText = result.Total
            issueCount.style.opacity = "1";

        })

      

    })

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

   if(lostAccounts.length > 0){

        lostAccounts.forEach((account)=>{

            let newNotification = document.createElement("div");
            newNotification.className = "notification employees";
            newNotification.innerHTML = 
            `
                <div class="icon">
                    <img src="../Icons/modals/person_white.svg" alt="">
                </div>
                <div class="main">
                    <label for="" class="title">Employee Issues</label>
                    <label for="" class="message"><span class="userName">${account.First_Name} ${account.Last_Name}</span> has forgotten his password. Click here to solve this issue.</label>
                </div>

            `

            notificationContainer.querySelector(".notifications").appendChild(newNotification)

            newNotification.addEventListener("click", (e)=>{

                if(modalOpened === true){
                    return;
                }

                let confirmNewPasswordBox = document.createElement("div");
                confirmNewPasswordBox.className = "confirmNewPasswordBox";
                confirmNewPasswordBox.innerHTML =
                `
                    <label for="passwordBox" id="lbl_container">
                        <label>This will be your employee's new password. Please copy and confirm.</label>
                        <input type="text" id="passwordBox">
                        <button id="copy">
                            <img src="../Icons/modals/clipboard.svg"/>
                        </button>
                    </label>
            
                    <button id="confirm">Confirm</button>
            
                `
                modalOpened = true;
                confirmNewPasswordBox.style.display = "none";
                confirmNewPasswordBox.tabIndex = "1";
            
                notificationContainer.appendChild(confirmNewPasswordBox)
                confirmNewPasswordBox.focus();

                confirmNewPasswordBox.style.top = e.pageY + "px";
                confirmNewPasswordBox.style.left = e.pageX + "px";

                confirmNewPasswordBox.style.display = "block";

                let textbox = confirmNewPasswordBox.querySelector("#passwordBox");
                textbox.value = Math.random().toString(36).slice(-8);
                // textbox.disabled = true;

                //Even Listeners
                confirmNewPasswordBox.addEventListener("blur", ()=>{

                    confirmNewPasswordBox.remove();
                    modalOpened = false;

                })

                let copy = confirmNewPasswordBox.querySelector("#copy");
                copy.addEventListener("click", ()=>{

                    textbox.select();
                    document.execCommand("copy")
                    // textbox.execCommand("")

                    confirmNewPasswordBox.querySelector("#lbl_container").querySelector("label").innerText = "Copied";

                })

                let btnConfirm = confirmNewPasswordBox.querySelector("#confirm");

                btnConfirm.addEventListener("click")

            })



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

}

//---------------------------------------Main Process Event Listeners-------------------------------------
ipcRenderer.on("setUserParams", (e, paramsArray)=>{

    [UserName, UserType] = paramsArray;

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







