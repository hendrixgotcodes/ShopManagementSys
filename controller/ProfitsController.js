"use strict";

const DOMCONTROLLER = require("./utilities/TableController");
const DATABASE = require("../model/DATABASE");

const database = new DATABASE();


window.addEventListener("load", ()=>{

    setTimeout(()=>{

        database.getItemOrderedMonthly()
        .then((items)=>{


            items.forEach((item)=>{

                DOMCONTROLLER.createProfitsItem(item.Name, item.Brand, item.Avg_Stock, item.Avg_Sale, item.Total_Sold, item.Revenue, item.Profit)

            })

        })

    },1000)

})