const hour = document.querySelector('.clock_hour');
const min = document.querySelector('.clock_min');
const blinker = document.getElementById('clock_blinker');
const ampm = document.querySelector('.ampm');
let now, hrs, mins, amPm;

let blinkerOn = true;

getTime();

setInterval(()=>{
    blinkerOn === true ? blinker.style.display = 'none' : blinker.style.display = 'inline';
    blinkerOn === true ? blinkerOn = false : blinkerOn = true;


    getTime()

}, 1000)

function getTime(){
    now = new Date();

    hrs = now.getHours();
    hrs = hrs > 12 ? hrs = hrs -12 : hrs = hrs;
    amPm = hrs >= 12 ? amPm = 'PM' : amPm= 'Am';

    hour.innerHTML = hrs;

    mins = now.getMinutes()
    mins = mins < 10 ? mins = `0${mins}` : mins = mins;

    min.innerHTML = mins;

}


