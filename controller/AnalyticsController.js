let userType = "Admin";
let userName = "Maame Dufie"

/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_clear')
const profit_card = document.querySelector(".profit");
const growthRateCard = document.querySelector('#growthRate')



/************EVENT LISTENERS */
toolBar_btn.addEventListener('mouseover',toggleTBbtn_white)
toolBar_btn.addEventListener('mouseleave',toggleTBbtn_default)
profit_card.addEventListener("click", loadProfits)
growthRateCard.addEventListener("click", loadGrowthRate)



/************FUNCTIONS */
function toggleTBbtn_white(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear.svg')
}

function toggleTBbtn_default(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear--green.svg')
}

function loadProfits(){
    ipcRenderer.send('loadProfits', [userName, userType])
}

function loadGrowthRate(){
    ipcRenderer.send('loadGrowthRate', [userName, userType])
}