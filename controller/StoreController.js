"use strict";


/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
import Notifications from '../controller/Alerts/NotificationController'
import Modal from './modals/ModalController';
import TableController from './utilities/TableController';
import UnitConverter from './utilities/UnitConverter';



/*********************************DOM ELEMENTS********************* */



const cart = [];     // Array of store objects
let salesMade = 0;       //Total sold Items

//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let totalSelectedRows = 0;

let footer_tbChanged = false;



/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const toolBarBtn = document.querySelector('.toolBar_btn')
const settings = document.querySelector('#settings');

const contentCover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content');

const footer_btn = document.querySelector('.footer_btn');
const footer_btn_icon = document.querySelector('.ico_footer_btn');

const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

const footer_tb = document.querySelector('.footer_tb');
const cartCount = document.querySelector('.cartCount');



/***********************************OBJECTS**************/
let sellingItem = {     // Represents an instance of a store item being added to cart
}



/*********************************EVent Listeners********************* */

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




//For "settings"
settings.addEventListener("click",(e)=>{
    contentCover.classList.toggle('contentCover--shown');
    openSettings();
})

//For "contentCover" To Close Modal Settings
contentCover.addEventListener('click', ()=>{
    removeSettingsModal(contentCover)

});



//For "footer_btn"
footer_btn.addEventListener('mouseover',toggleTBbtn_white);
footer_btn.addEventListener('mouseleave',toggleTBbtn_default);

footer_btn.addEventListener("click", (e)=>{
    e.preventDefault();

    //Displays Modal to show selected Items
    showItemsInCart();
    // calling function to uncheck checked rows
    // uncheckMarkedRows()
})


//For "tableBody"
tableROWS.forEach((row)=>{
    row.addEventListener('click',(e)=>{
        toggleRowCB(row);
        setSellingItemProperties(row);
    })
})



//For "footer_tb"
footer_tb.addEventListener("blur",()=>{

    if(sellingItem.amountPurchased !== undefined && footer_tbChanged !== true){

        disableDropDownList()
        footer_tb.selectedIndex = 0;  //Resets Default value of drop down list
        cart.push(sellingItem)
        sellingItem = {};
        
    }

})

mainBodyContent.addEventListener('click', (e)=>{
    if(!(e.target.classList.contains('footer_tb') || e.target.classList.contains('footer_btn'))){
          
    }
})

footer_tb.addEventListener("change",()=>{

    cartCount.style.transform = "scale(1)"
    cartCount.innerText = totalSelectedRows;
    sellingItem.amountPurchased = footer_tb.value;

    footer_tbChanged = false;

    if(footer_tb.selectedIndex > 1){
        footer_btn.disabled = false;
    }
    
})

footer_tb.addEventListener("focus",()=>{
    footer_tbChanged = true;
    console.log(footer_tbChanged);
})



/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */



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
//Opens Setting modal
function removeSettingsModal(cover){
    if (mainBodyContent.querySelector('.settingsModal') !== null){
        mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
    }

    cover.classList.toggle('contentCover--shown');
}


//-----------------------------------------------------------------------------------------------
function toggleTBbtn_white(){
    footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout.svg')
}


//-----------------------------------------------------------------------------------------------
function toggleTBbtn_default(){
    footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout--green.svg')
}

//-----------------------------------------------------------------------------------------------
function toggleRowCB(row){

    if(sellingItem.amountPurchased === undefined && footer_tbChanged === true){
        Notifications.showNotification('Please specify the number of items to be sold first', true);

        footer_tb.focus();
        
        return;
    }
    
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
            cartCount.innerText = totalSelectedRows;
        }

        if(totalSelectedRows === 0){
            disableDropDownList();

            // cartCount.style.transform = "scale(0)"
            cartCount.style.transform = "scale(0)"
            cartCount.innerText = 0;
        }

    }
    else{
        CB.checked = true

        totalSelectedRows = totalSelectedRows +1;

        if(totalSelectedRows > 0){
            
            enableDropDownList();

            if(toolBarTB.disabled === false){
                footer_tb.focus()
            }
        }

    }
}

//-----------------------------------------------------------------------------------------------
function disableDropDownList(){
    footer_tb.disabled = true;
}

//-----------------------------------------------------------------------------------------------
function enableDropDownList(){
    footer_tb.disabled = false;

}

//-----------------------------------------------------------------------------------------------
function setSellingItemProperties(row){
    sellingItem.name = row.querySelector('.td_Names').innerText
    sellingItem.brand = row.querySelector('.td_Brands').innerText
    sellingItem.category = row.querySelector('.td_Category').innerText
    sellingItem.price = row.querySelector('.td_Price').innerText;
}

//-----------------------------------------------------------------------------------------------
function amtPurchased(amntPurchased){
    sellingItem.amountPurchased = amntPurchased;
}


//-----------------------------------------------------------------------------------------------
// function to show item in cart
function showItemsInCart(){


    console.log(cart);

    Modal.createCheckout(cart, totalSelectedRows,cartCount)
    .then((returned)=>{


         salesMade = salesMade + returned;


         //Parsing it through a converter
          let forSpan = UnitConverter.convert(salesMade);

         document.querySelector('#salesMade_amount').innerText = forSpan;

    })
}


//-----------------------------------------------------------------------------------------------







