/**
 * @param {HTMLTableElement} tableEl
 */

const { ipcRenderer } = require("electron");

/*********************************DOM ELEMENTS********************* */
const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];





/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const settings = document.querySelector('#settings');
const contentCover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content')




/*********************************EVent Listeners********************* */

tip_default.addEventListener('click',()=>{
    selectValue_span.innerHTML = "Filter By:"
    selectValue_span.setAttribute("value", "default");
})

//For ToolBarTB
// toolBarTB.addEventListener('keyup',(e)=>{
//     removeTR(toolBarTB.value)
// })


//For Settings
settings.addEventListener("click",(e)=>{
    contentCover.classList.toggle('contentCover--shown');
    openSettings();
})

//For modalSlider




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


//Send message to open Settings Window
function openSettings(){
    ipcRenderer.send('open_settings');
}

