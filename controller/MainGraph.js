// const Chart = require('chartjs')
import { left, right } from '@popperjs/core';
import Chart from 'chart.js'
import Millify from 'millify';
import DATABASE from '../model/DATABASE';
import Modal from './modals/ModalController';


/**************DOM ELEMENTS************************/
const signout = document.getElementById("signout");

const totalSalesMade = document.querySelector("#totalSalesMade").querySelector(".valueLabel");
const totalItemsSold = document.querySelector("#totalItemsSold").querySelector(".valueLabel");
const gross_revenue = document.querySelector("#gross_revenue").querySelector(".valueLabel");
const grossProfit = document.querySelector("#grossProfit").querySelector(".valueLabel");
const profitPercentage = document.querySelector("#profitPercentage").querySelector(".valueLabel");
const averageBasketValue = document.querySelector("#averageBasketValue").querySelector(".valueLabel")
const cardsContainer = document.querySelector(".cardsContainer");

///Calenders
const footerDate_from = document.querySelector("#footerDate_from");
const footerDate_to = document.querySelector("#footerDate_to");

//Btns
const footer_btn = document.querySelector(".footer_btn");


var ctx = document.getElementById('myChart').getContext("2d");

const database = new DATABASE();




var myChart = new Chart(ctx, {
    type: 'line',
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
    },
    // onAnimationComplete: function () {
    //     var sourceCanvas = this.chart.ctx.canvas;
    //     // the -5 is so that we don't copy the edges of the line
    //     var copyWidth = this.scale.xScalePaddingLeft - 5;
    //     // the +5 is so that the bottommost y axis label is not clipped off
    //     // we could factor this in using measureText if we wanted to be generic
    //     var copyHeight = this.scale.endPoint + 5;
    //     var targetCtx = document.getElementById("myChartAxis").getContext("2d");
    //     targetCtx.canvas.width = copyWidth;
    //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
    // }
});




// const brandSection = document.querySelector(".brandSection").getContext("2d");

// const brandSectionChart = new Chart(brandSection, {

//     type: "doughnut",
//     data: {
//         labels: ['Marshall', 'Fuego', 'Nvidia', 'HP'],
//         datasets:[
//             {
//                 label: 'Purchase frequency',
//                 data: [500, 1200, 2000, 100],
//                 backgroundColor: [
//                     'rgb(102, 75, 64)',
//                     'rgb(53, 89, 75)',
//                     'rgb(73, 179, 18)',
//                     'rgb(53, 190, 98)',

//                 ]
//             }
//         ]
//     },
//     options: {
//         title: {
//             display: true,
//             text: "Top Brands",
//             fontFamily: `'Roboto', 'sans-serif'`,
//             fontSize: 20,
//             fontColor: ' #35594B'
//         },
//         legend:{
//             position: right
//         }
//     }

// })


/**************************EVENT LISTENERS***************************/
signout.addEventListener("click", openExitDialogBox)

// window.addEventListener("load", getLastWeek)
footer_btn.addEventListener("click", (e)=>{

    e.preventDefault()

    let from = footerDate_from.value;
    let to = footerDate_to.value;

    plotData(from, to)

    displayTopItems(from, to)

})




/**************************FUNCTIONS********************************/
function openExitDialogBox(){

    Modal.openExitPrompt()
    .then(()=>{

        ipcRenderer.send("loadLogin");

    })


}

function plotData(from, to){

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

    const date = new Date();

 

    let newFrom = `${dayNames[date.getDay(from)], monthNames[date.getMonth(from)]} ${date.getFullYear()}`;
    let newTo = `${dayNames[date.getDay(to)], monthNames[date.getMonth(to)]} ${date.getFullYear()}`
    

    database.getSaleRecords(from, to)
    .then((result)=>{

        let [days, revenues, totalRevenue, totalProfit, salesMade, itemsSold, colors] = result;

        myChart.data.labels = days;
        myChart.data.datasets = [
            {
                label: "Sales Made",
                data: revenues,
                borderColor: '#35594B',
                borderWidth: 2,
                backgroundColor: colors,
                fill: false
            }
        ]

        myChart.update()


        /********UPDATING DOM  ELEMENTS***********/
        gross_revenue.innerText= `GH¢${Millify(parseFloat(totalRevenue).toPrecision(3))}`
        grossProfit.innerText = `GH¢${Millify(parseFloat(totalProfit).toPrecision(3))}`;
        profitPercentage.innerText = `${parseFloat((totalProfit/parseFloat(totalRevenue).toPrecision(3))*100).toPrecision(3)}%`
        totalSalesMade.innerText = salesMade;
        totalItemsSold.innerText = itemsSold;
        averageBasketValue.innerText = parseInt(itemsSold/salesMade);  
        
    })
    .catch((error)=>{
        throw error
    })

}

function displayTopItems(from, to){

    database.getTopItems(from, to)
    .then((result)=>{

        cardsContainer.innerHTML = "";

        const promises = []
        promises.push(result)

        Promise.all(promises)
        .then((result)=>{

            result = result.shift();

            result.forEach((item)=>{

                const innerCardTemplate =
                `
                <div class="itemDetails">
    
                    <h3 class="itemName itemHeader">${item.Name}</h3>
                    
                    <lablel class="itemLabel itemBrand">Brand: <span class="itemBrand_value">${item.Brand}</span></lablel>
                    <lablel class="itemLabel itemCategory">Category: <span class="itemCategory_value">${item.Category}</span></lablel>
    
                </div>
                <div class="itemStats">
    
                    <label class="totalSales">
                        <h3 class="totalSales_value itemHeader">${item.Sold}</h3>
                        <label class="totalSales_label">Total Sales</label>
                    </label>
    
                    <label class="totalProfit">
    
                        <h3 class="totalProfit_value itemHeader">GH¢${item.Profit}</h3>
                        <label class="totalProfit_label">Total Profit</label>
    
                    </label>
    
                </div>
    
                `
    
                const newCard = document.createElement("div");
                newCard.className = "items";
                newCard.innerHTML = innerCardTemplate;
    
                cardsContainer.appendChild(newCard)
    
            })

        })

    })
    .catch((error)=>{

        throw error

    })

}