const { default: Millify } = require("millify");
let validator = require('is-my-date-valid');
const { default: clip } = require("text-clipper");
const { readdir } = require("fs");
validator = validator({format: "YYY-MM-DD"})

let userType = "Admin";
let userName = "Maame Dufie"



/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_clear')
const profit_card = document.querySelector(".profit");
const product_card = document.querySelector(".product");
const topUser_card = document.querySelector(".topUser");
const growthRateCard = document.querySelector('#growthRate')

const profit = profit_card.querySelector(".card_content");
const topItem = product_card.querySelector(".card_content");
const topUser = topUser_card.querySelector(".card_content");

const profitValueFrom = profit_card.querySelector(".valueFrom");
const profitValueTo = profit_card.querySelector(".valueTo");
const topItemValueFrom = product_card.querySelector(".valueFrom");
const topItemValueTo = product_card.querySelector(".valueTo");
const topUserValueFrom = topUser_card.querySelector(".valueFrom");
const topUserValueTo = topUser_card.querySelector(".valueTo");

const endtP = document.querySelector(".endtP");
const starttP = document.querySelector(".starttP");
const toolBarSlct_btn = document.querySelector(".toolBarSlct_btn");
const toolBarDate_from = document.querySelector("#toolBarDate_from");
const toolBarDate_to = document.querySelector("#toolBarDate_to")




/************EVENT LISTENERS */


toolBar_btn.addEventListener('mouseover',toggleTBbtn_white)
toolBar_btn.addEventListener('mouseleave',toggleTBbtn_default)

profit_card.addEventListener("click", loadProfits)
growthRateCard.addEventListener("click", loadGrowthRate)
toolBarSlct_btn.addEventListener("click", (e)=>{
    fetchAnalyticsData(e)
})


/******************Initializers */
initializeData();
initializeDateRangeSales()



/************FUNCTIONS */
function toggleTBbtn_white(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear.svg')
}

function toggleTBbtn_default(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear--red.svg')
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

        database.getTotalProfit(toolBarDate_from.value, toolBarDate_to.value)
        .then((result)=>{

            profit.innerText = `GHc ${Millify(result, {
                precision: 3
            })}`;

            profitValueFrom.innerText = readableDate(toolBarDate_from.value);
            profitValueTo.innerText = "to " + readableDate(toolBarDate_to.value);

        })

        database.getMostSoldItem(toolBarDate_from.value, toolBarDate_to.value)
        .then((item)=>{

            topItem.innerText = clip(item, 15);

            topItemValueFrom.innerText = readableDate(toolBarDate_from.value);
            topItemValueTo.innerText = "to " + readableDate(toolBarDate_to.value)

        })

        database.getUserWithMostSales(toolBarDate_from.value, toolBarDate_to.value)
        .then((user)=>{

            topUser.innerText = clip(user, 15);

            topUserValueFrom.innerText = readableDate(toolBarDate_from.value);
            topUserValueTo.innerText = "to " + readableDate(toolBarDate_to.value);

        })

    }


}

function initializeData(){

    database.getTotalProfitLastMonth()
    .then((totalProfit)=>{


        profit.innerText = `GHc ${Millify(totalProfit, {
            precision: 3
        })}`

    })

    database.getMostSoldItemMonth()
    .then((item)=>{

        topItem.innerText = clip(item, 15);

    })

    database.getUserWithMostSalesLastMonth()
    .then((user)=>{

        topUser.innerText = clip(user, 15);

    })

}

function initializeDateRangeSales(){

    database.getDateRangeSales()
    .then((date)=>{


        if(date.Maximum === null && date.Minimum === null){

            toolBarDate_from.disabled = true;
            toolBarDate_to.disabled = true;

            toolBarSlct_btn.disabled = true;
            toolBar_btn.disabled = true;
            return;
        }

        toolBarDate_from.min = date.Minimum;
        toolBarDate_from.max = date.Maximum;

        toolBarDate_to.min = date.Minimum;
        toolBarDate_to.max = date.Maximum;

    })

}

function readableDate(date){

    console.log(date);

    let [year, month, day] = date.split("-");

    let months = ["", "Jan", "Feb", "Mar" , "Apr",  "May", "June", "July", "Aug", "Sept",  "Oct", "Nov", "Dec"];

    if(day === "1" || day === "21" || day === "31"){

        day = day + "st"

    }
    else if(day === "2" || day === "22"){

        day = day + "nd";

    }
    else if(day === "3" || day === "23"){
        day = day + "rd";
    }
    else{
        day = day + "th";
    }

    month = months[parseInt(month)];

    return `${day} ${month}, ${year}`;

}