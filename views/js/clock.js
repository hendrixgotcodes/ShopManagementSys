const hour = document.querySelector('.clock_hour');
const min = document.querySelector('.clock_min');
const blinker = document.getElementById('clock_blinker');
const ampm = document.querySelector('.clock_ampm');
let now, hrs, mins, amPm;

let blinkerOn = true;

//Initially gets and sets the time
getTime();

//Repeatedly gets and sets time
setInterval(()=>{
    blinkerOn === true ? blinker.style.display = 'none' : blinker.style.display = 'inline';
    blinkerOn === true ? blinkerOn = false : blinkerOn = true;


    getTime()

}, 1000)


//Function called to get and set time
function getTime(){
    now = new Date();

    hrs = now.getHours();
    let originalHrs =hrs;

    amPm = hrs >= 12 ? amPm = 'PM' : amPm= 'AM';

    hrs = hrs === 0 ? hrs = 12 : hrs= hrs;
    hrs = hrs > 12 ? hrs = hrs -12 : hrs = hrs;



    // amPm = originalHrs === 0 ? amPm = 'AM' : amPm= 'PM';

    


    hour.innerHTML = hrs;

    mins = now.getMinutes()
    mins = mins < 10 ? mins = `0${mins}` : mins = mins;

    min.innerHTML = mins;
    ampm.innerHTML = amPm;

}


