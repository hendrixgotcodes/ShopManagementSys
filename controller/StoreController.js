/**
 * @param {HTMLTableElement} tableEl
 */


/*********************************DOM ELEMENTS********************* */
const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];
const cart = [];

//Holds the amount of table rows selected so that disabling and enabling of elements can be done based on that amount
let selectedRows = 0;



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
footer_btn.addEventListener('mouseover',toggleTBbtn_white)
footer_btn.addEventListener('mouseleave',toggleTBbtn_default)


//For "tableBody"
tableROWS.forEach((row)=>{
    row.addEventListener('click',(e)=>{
        toggleRowCB(row);
    })
})



//For "footer_tb"
footer_tb.addEventListener("blur",()=>{
    disableDropDownList()
    footer_tb.selectedIndex = 0;
})

footer_tb.addEventListener("change",()=>{
    cartCount.style.transform = "scale(1)"
    cartCount.innerText = selectedRows;
})




/*************************************FUNCTIONS********************* */
function wrapText(text){

    return text.length > 5 ? text.slice(0,5) + '....' : text;
   
}



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

//Opens Setting modal
function removeSettingsModal(cover){
    if (mainBodyContent.querySelector('.settingsModal') !== null){
        mainBodyContent.removeChild(mainBodyContent.querySelector('.settingsModal'));
    }

    cover.classList.toggle('contentCover--shown')
}


function toggleTBbtn_white(){
    footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout.svg')
}

function toggleTBbtn_default(){
    footer_btn_icon.setAttribute('src', '../Icons/toolBar/checkout--green.svg')
}


function toggleRowCB(row){
    let CB = row.querySelector('.td_cb').querySelector('.selectOne');



    if(CB.checked === true){
        CB.checked = false;
        row.style.transform = "translateX(0px)"
        row.style.outline = "none"


        if(selectedRows > 0){
            selectedRows = selectedRows -1;
        cartCount.innerText = selectedRows;
        }

        if(selectedRows === 0){
            disableDropDownList();

            cartCount.style.transform = "scale(0)"
            cartCount.innerText = 0;
        }
    }
    else{
        CB.checked = true

        selectedRows = selectedRows +1;

        if(selectedRows > 0){
            
            enableDropDownList();

            if(toolBarTB.disabled === false){
                footer_tb.focus()
            }
        }
    }
}

function disableDropDownList(){
    footer_tb.disabled = true;
}

function enableDropDownList(){
    footer_tb.disabled = false;

}






