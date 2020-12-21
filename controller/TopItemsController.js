"use strict";

const DOMCONTROLLER = require("./utilities/TableController");
const DATABASE = require("../model/DATABASE");
const { default: Modal } = require("./modals/ModalController");
let validator = require('is-my-date-valid');


const database = new DATABASE();
validator = validator({format: "YYY-MM-DD"})


const profit = document.querySelector(".Profits");
const profit_amount = profit.querySelector("#profit_amount");

let mode = "monthly";

/**********************DOM ELEMENTS**********/
const thProfit = document.querySelector("thead").querySelector(".th_profit");
const endtP = document.querySelector(".endtP");
const starttP = document.querySelector(".starttP");
const toolBarSlct_btn = document.querySelector(".toolBarSlct_btn");
const toolBarDate_from = document.querySelector("#toolBarDate_from");
const toolBarDate_to = document.querySelector("#toolBarDate_to")





/*******Initializers */
initializeItems();
initializeDateRangeSales();


/**************Event Listeners*****************/

toolBarSlct_btn.addEventListener("click", (e)=>{
    fetchAnalyticsData(e)
})




const tableHeads = document.querySelectorAll("th");

tableHeads.forEach((tHead)=>{

    tHead.addEventListener("click", ()=>{


        const tableEl = tHead.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(tHead.parentElement.parentElement.children, tHead);
        const isAsc = tHead.classList.contains("th-sort-asc");

        const searchKey = tHead.getAttribute("targetRow");

        if(tHead.classList.contains("string")){

            sortTableByColumn(tableEl,  headerIndex, !isAsc, false, tHead, searchKey);

        }
        else{

            sortTableByColumn(tableEl,  headerIndex, !isAsc, true, tHead, searchKey);

        }

    })

})


profit.addEventListener("click", ()=>{

    if(mode === "monthly"){

        Modal.openProfitsDialogLoading();

        database.getGenerealStatsLastMonth()
        .then(([sales, discount, revenue, profit])=>{

            Modal.openProfitsDialog(sales,discount, revenue, profit )


        })
        .catch(()=>{

            Modal.openProfitsDialogError();

        })

    }


})





/************************FUNCTIONS******************/
function toggleTBbtn_white(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear.svg')
}

function toggleTBbtn_default(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnClear--red.svg')
}

function initializeItems(){

    database.getTopItemOrderedMonthly()
    .then((items)=>{


        items.forEach((item)=>{

            DOMCONTROLLER.createProfitsItem(item.Name, item.Brand, item.Avg_Stock, item.Avg_Sale, item.Total_Sold, item.Revenue, item.Profit)

        })

    })

    database.getTotalProfitLastMonth()
    .then((Profit)=>{

        if(Profit===null){
            Profit = "0.00"
        }

        profit_amount.innerText = Profit;

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


function sortTableByColumn(table, column, asc = true, makeInt, TH, searchKey) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        let aColText = a.querySelector(searchKey).textContent.trim();
        let bColText = b.querySelector(searchKey).textContent.trim();

        if(makeInt === true){

            aColText = parseFloat(aColText);
            bColText = parseFloat(bColText)

        }

        return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    TH.classList.remove("th-sort-asc", "th-sort-desc");
    TH.classList.toggle("th-sort-asc", asc);
    TH.classList.toggle("th-sort-desc", !asc);
}



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

        DOMCONTROLLER.showLoadingBanner("Please wait...")

        const tableRows = document.querySelector("tbody").querySelectorAll("tr");
        tableRows.forEach((tableRow)=>{

            tableRow.remove();

        })

        database.getTopItems(toolBarDate_from.value, toolBarDate_to.value)
        .then((items)=>{


            items.forEach((item)=>{

                console.log();

                DOMCONTROLLER.createProfitsItem(item.Name, item.Brand, item.Avg_Stock, item.Avg_Sale, item.Total_Sold, item.Revenue, item.Profit)

            })

            DOMCONTROLLER.removeOldBanners();

        })


        database.getTotalProfit(toolBarDate_from.value, toolBarDate_to.value)
        .then((Profit)=>{

            if(Profit === null){
                Profit = "0.00"
            }

            profit_amount.innerText = Profit;


        })

      
    }


}

