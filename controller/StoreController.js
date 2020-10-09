/**
 * @param {HTMLTableElement} tableEl
 */

const { ipcRenderer } = require("electron");

/*********************************DOM ELEMENTS********************* */
const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];
const userType = 'Maame Dufie'




/*********************************DOM ELEMENTS********************* */
const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');
const toolBarTB = document.querySelector('.toolBar_tb');
const settings = document.querySelector('#settings');
const contentCover = document.querySelector('.contentCover');
const mainBodyContent = document.querySelector('.mainBody_content')
const goto_Store = document.querySelector('#goto_store')
const goto_Inventory = document.querySelector('#goto_inventory');
const goto_Analytics = document.querySelector('#goto_analytics');




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


//For "goto_Inventory"
goto_Store.addEventListener('click',loadStore)
goto_Inventory.addEventListener('click',loadInventory)
goto_Analytics.addEventListener('click', loadAnalytics);




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

//Triggers an event to load the pages in the  ipcMain
function loadStore(){
    ipcRenderer.send('loadStore', userType)
}

function loadInventory(){
    ipcRenderer.send('loadInventory',userType)
}

function loadAnalytics(){
    ipcRenderer.send('loadAnalytics',userType)
}


