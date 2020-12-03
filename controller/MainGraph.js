// const Chart = require('chartjs')
import { left, right } from '@popperjs/core';
import Chart from 'chart.js'
import Millify from 'millify';
import DATABASE from '../model/DATABASE';


/**************DOM ELEMENTS************************/
const select_footer = document.querySelector("#select_footer");

const totalSalesMade = document.querySelector("#totalSalesMade").querySelector(".valueLabel");
const totalItemsSold = document.querySelector("#totalItemsSold").querySelector(".valueLabel");
const gross_revenue = document.querySelector("#gross_revenue").querySelector(".valueLabel");
const grossProfit = document.querySelector("#grossProfit").querySelector(".valueLabel");
const profitPercentage = document.querySelector("#profitPercentage").querySelector(".valueLabel");
const averageBasketValue = document.querySelector("#averageBasketValue").querySelector(".valueLabel")


var ctx = document.getElementById('myChart').getContext("2d");

const database = new DATABASE();


var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Sales made',
            data: [],
            // backgroundColor: [
            //     ' rgba(239, 182, 38, 1)',
            //     'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            // ],
            borderColor: [
                '#EFB526',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 5
        }]
    },
    options: {
        // title: {

        //     display: true,
        //     text: "Shop Growth In The Last Week"

        // },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});




const brandSection = document.querySelector(".brandSection").getContext("2d");

const brandSectionChart = new Chart(brandSection, {

    type: "doughnut",
    data: {
        labels: ['Marshall', 'Fuego', 'Nvidia', 'HP'],
        datasets:[
            {
                label: 'Purchase frequency',
                data: [500, 1200, 2000, 100],
                backgroundColor: [
                    'rgb(102, 75, 64)',
                    'rgb(53, 89, 75)',
                    'rgb(73, 179, 18)',
                    'rgb(53, 190, 98)',

                ]
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Top Brands",
            fontFamily: `'Roboto', 'sans-serif'`,
            fontSize: 20,
            fontColor: ' #35594B'
        },
        legend:{
            position: right
        }
    }

})


/**************************EVENT LISTENERS***************************/
window.addEventListener("load", getLastWeek)
select_footer.addEventListener("change", (e)=>{

    let userSelection = select_footer.value;

    switch (userSelection){

        case "Last Week":
            getLastWeek();
            break;

        case "Last Month":
            getLastMonth();
            break;
        
        case "Last Year":
            getLastYear();
            break;

        default:
            getLastWeek();


    }


})




/**************************FUNCTIONS********************************/
function plotData(result, timePeriod){

    let [days, revenues, totalRevenue, totalProfit, salesMade, itemsSold, colors] = result;

        myChart.data.labels = days;
        myChart.data.datasets = [
            {
                label: `Sales Made Last ${timePeriod}`,
                data: revenues,
                borderColor: colors,
                borderWidth: 3,
                backgroundColor: colors
            }
        ]

        myChart.update()


        /********UPDATING DOM  ELEMENTS***********/
        gross_revenue.innerText= `GH¢${Millify(parseFloat(totalRevenue))}`
        grossProfit.innerText = `GH¢${Millify(parseFloat(totalProfit))}`;
        profitPercentage.innerText = `${parseFloat((totalProfit/parseFloat(totalRevenue))*100).toPrecision(3)}%`
        totalSalesMade.innerText = salesMade;
        totalItemsSold.innerText = itemsSold;
        averageBasketValue.innerText = parseFloat(itemsSold/salesMade).toPrecision(3);  

}

function getLastWeek(){

    database.getLastWeekSale()
    .then((result)=>{

        plotData(result, "Week")

    })
    .catch((error)=>{

        throw error

    })

}

function getLastMonth(){

    database.getLastMonthSale()
    .then((result)=>{

        plotData(result, "Month")

    })
    .catch((error)=>{

        throw error

    })

}

function getLastYear(){

    database.getLastYearSale()
    .then((result)=>{

        plotData(result, "Year")

    })
    .catch((error)=>{
        throw error
    })

}