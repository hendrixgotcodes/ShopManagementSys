/**
 * @param {HTMLTableElement} tableEl
 */


/**********************************IMPORTED ***************************/
import Notifications from '../controller/Alerts/NotificationController'


/*********************************DOM ELEMENTS********************* */
const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];

// Array of store objects
const cart = [];

//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let totalSelectedRows = 0;
let selectedRows = [];

let canSelectRow = true;



/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
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
})

//For ToolBarTB
// toolBarTB.addEventListener('keyup',(e)=>{
//     removeTR(toolBarTB.value)
// })


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
    uncheckMarkedRows()
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
    disableDropDownList()
    footer_tb.selectedIndex = 0;  //Resets Default value of drop down list
    cart.push(sellingItem)
    sellingItem = {};
})

footer_tb.addEventListener("change",()=>{
    cartCount.style.transform = "scale(1)"
    cartCount.innerText = totalSelectedRows;
    sellingItem.amountPurchased = footer_tb.value;
})




/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
/*************************************FUNCTIONS********************* */
function wrapText(text){

    return text.length > 5 ? text.slice(0,5) + '....' : text;
   
}


//-----------------------------------------------------------------------------------------------
function removeTR(value){

    const tableEl = document.querySelector('table');
    const tbody = tableEl.tBodies[0];
    
    const tRows = tbody.querySelectorAll('tr');

    value = value.toLocaleLowerCase();

    console.log(value);

    const array = [];

    tRows.forEach((row)=>{
        

            if((row.querySelector('.td_Names').innerHTML.toLocaleLowerCase() === value)){
                row.style.display = "none";
            }
            else{
                row.style.display = "block";
            }
        
        
       
    })

   
    
};


//-----------------------------------------------------------------------------------------------
//Opens Setting modal
function removeSettingsModal(cover){
    if (mainBodyContent.querySelector('.settingsModal') !== null){
        mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
    }

    cover.classList.toggle('contentCover--shown')
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
    if(canSelectRow === false){
        Notifications.showNotification('Please select the number of items to be sold first');

        setTimeout(()=>{
            Notifications.hideNotification();
        },2000);
        
        return;
    }
    
    let CB = row.querySelector('.td_cb').querySelector('.selectOne');

    if(CB.checked === true){
        CB.checked = false;
        row.style.transform = "translateX(0px)"
        row.style.outline = "none"



        if(totalSelectedRows > 0){
            totalSelectedRows = totalSelectedRows -1;
            cartCount.innerText = totalSelectedRows;
        }

        if(selectedRows === 0){
            disableDropDownList();

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

        markSelectedRow(row);
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
}

//-----------------------------------------------------------------------------------------------
function amtPurchased(amntPurchased){
    sellingItem.amountPurchased = amntPurchased;
}


//-----------------------------------------------------------------------------------------------
// function to show item in cart
function showItemsInCart(){
    cartCount.style.transform = "scale(0)"
    cartCount.innerText = 0;
}


//-----------------------------------------------------------------------------------------------
// Saving checked rows in "selectedRows"
function markSelectedRow(row){

        let aRow = {}
        aRow.key = row.querySelector('.td_Names').innerText;
        aRow.value = row;
        selectedRows.push(aRow);

}

// Uncheck checked rows. Does so by iterating through the arrray of "selectedRows" which contains all selectedRows
function uncheckMarkedRows(){

       selectedRows.forEach((row)=>{
           row.value.querySelector('.td_cb').querySelector('.selectOne').checked = false;
       })

}





