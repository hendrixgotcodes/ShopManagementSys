const { default: Millify } = require("millify");
let validator = require('is-my-date-valid');
validator = validator({format: "YYY-MM-DD"})

let userType = "Admin";
let userName = "Maame Dufie"



/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_clear')
const profit_card = document.querySelector(".profit");
const growthRateCard = document.querySelector('#growthRate')

const profit = profit_card.querySelector(".card_content");

const endtP = document.querySelector(".endtP");
const starttP = document.querySelector(".starttP");
const toolBarSlct_btn = document.querySelector(".toolBarSlct_btn");
const toolBarDate_from = document.querySelector("#toolBarDate_from");
const toolBarDate_to = document.querySelector("#toolBarDate_to")




/************EVENT LISTENERS */
window.addEventListener("load", (e)=>{

    database.getDateRangeSales()
    .then((date)=>{

        console.log(date, date.Minimum, date.Maximum);

        if(date.Maximum === null && date.Minimum === null){
            
            toolBarDate_from.disabled = true;
            toolBarDate_to.disabled = true;

            toolBarSlct_btn.disabled = true;
            return;
        }

        toolBarDate_from.min = date.Minimum;
        toolBarDate_from.max = date.Maximum;

        toolBarDate_to.min = date.Minimum;
        toolBarDate_to.max = date.Maximum;

    })

})

toolBar_btn.addEventListener('mouseover',toggleTBbtn_white)
toolBar_btn.addEventListener('mouseleave',toggleTBbtn_default)
profit_card.addEventListener("click", loadProfits)
growthRateCard.addEventListener("click", loadGrowthRate)
toolBarSlct_btn.addEventListener("click", (e)=>{
    fetchAnalyticsData(e)
})



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

// const store = new STORE({
//     configName: 'timeDifference--analytics',
//     defaults: {
//         toolTipsPref: 'show',
//         timeOutPref: '1',
//     }
// });


function fetchAnalyticsData(e){

    e.preventDefault();


    if(toolBarDate_from.value === "" || toolBarDate_to.value === ""){

        if(toolBarDate_from.value === ""){

            starttP.style.opacity = "1";
    
            setTimeout(()=>{
                starttP.style.opacity = "0";
            }, 2000)
    
        }
    
        if(toolBarDate_to.value === ""){
    
            endtP.style.opacity = "1";
    
            setTimeout(()=>{
                endtP.style.opacity = "0";
            }, 2000)
    
        }

    }
    else if(validator(toolBarDate_from.value) === false || validator(toolBarDate_to.value) === false){

        if(validator(toolBarDate_from.value) === false){

            starttP.innerText = "Invalid date";
            starttP.style.opacity = "1";

            setTimeout(()=>{
                
                starttP.style.opacity = "0";
                starttP.innerText = "Please select a start date";

            }, 2000)

        }
        if(validator(toolBarDate_to.value) === false){

            endtP.innerText = "Invalid date";
            endtP.style.opacity = "1";

            setTimeout(()=>{
                
                starttP.style.opacity = "0";
                starttP.innerText = "Please select an end date";

            }, 2000)

        }

    }
    else{

        database.getTotalProfit()
        .then((result)=>{

            profit.innerText = `GHc ${Millify(result)}`;

        })

    }


}