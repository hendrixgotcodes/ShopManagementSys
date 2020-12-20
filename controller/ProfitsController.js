"use strict";

const DOMCONTROLLER = require("./utilities/TableController");
const DATABASE = require("../model/DATABASE");
const { default: Modal } = require("./modals/ModalController");

const database = new DATABASE();

const profit = document.querySelector(".Profits");
const profit_amount = profit.querySelector("#profit_amount");

let mode = "monthly";




/*******Initializers */
initializeItems();


profit.addEventListener("click", ()=>{

    // if(mode === "monthly"){

    //     database.getGeneralStatsLastMonth()
    //     .then(([])=>{



    //     })

    // }

    Modal.openProfitsDialog("223","20202", "30000", "500" )

})

function initializeItems(){

    database.getItemOrderedMonthly()
    .then((items)=>{


        items.forEach((item)=>{

            DOMCONTROLLER.createProfitsItem(item.Name, item.Brand, item.Avg_Stock, item.Avg_Sale, item.Total_Sold, item.Revenue, item.Profit)

        })

    })

    database.getTotalProfitLastMonth()
    .then((Profit)=>{

        profit_amount.innerText = Profit;

    })

}