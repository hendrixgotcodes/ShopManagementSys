// const Chart = require('chartjs')
import { right } from '@popperjs/core';
import Chart from 'chart.js'

var ctx = document.getElementById('myChart').getContext("2d");


var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [200, 109, 30, 500, 299.9, 13],
            backgroundColor: [
                ' rgba(239, 182, 38, 0.01)',
                'rgba(54, 162, 235, 0.01)',
                'rgba(255, 206, 86, 0.01)',
                'rgba(75, 192, 192, 0.01)',
                'rgba(153, 102, 255, 0.01)',
                'rgba(255, 159, 64, 0.01)'
            ],
            borderColor: [
                ' #EFB526',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        title: {

            display: true,
            text: "Shop Growth Since March, 2020"

        },
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
        labels: ['Apple', 'Samsung', 'Huawei', 'N/A', 'Infinix'],
        datasets:[
            {
                label: 'Purchase frequency',
                data: [500, 1200, 2000, 100, 150],
                backgroundColor: [
                    'rgb(102, 75, 64)',
                    'rgb(53, 89, 75)',
                    'rgb(73, 179, 18)',
                    'rgb(53, 190, 98)',
                    'rgb(73, 100, 138)',

                ]
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Brands' Stats",
            fontFamily: `'Roboto', 'sans-serif'`,
            fontSize: 20,
            fontColor: ' #35594B'
        },
        legend:{
            position: right
        }
    }

})