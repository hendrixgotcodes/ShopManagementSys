// const Chart = require('chartjs')
import { right } from '@popperjs/core';
import Chart from 'chart.js'

var ctx = document.getElementById('myChart').getContext("2d");


var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['First Week', 'Second Week', 'Third Week', 'Fourth Week'],
        datasets: [{
            label: '# of Votes',
            data: [200, 109, 30, 500],
            backgroundColor: [
                ' rgba(239, 182, 38, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
            ],
            borderColor: [
                ' #EFB526',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2
        }]
    },
    options: {
        title: {

            display: true,
            text: "Shop Growth In The Last Month"

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