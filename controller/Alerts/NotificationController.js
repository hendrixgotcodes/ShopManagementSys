/***********AUDIO FILES*********/
const winAlert = new Audio('../../utils/media/syssounds/win10.mp3')

/**********DOM ELEMENTS*********/
const notification_banner = document.querySelector('.notification_banner');

class Notifications{
    static showNotification(message, boolean){
        notification_banner.querySelector('span').innerText = message
        notification_banner.style.transform = "translateX(0%)"

        if(boolean===true){
            notification_banner.querySelector('.banner_arrow').classList.add("banner_arrow--show")
            console.log(true);
        }


        winAlert.play();

        setTimeout(()=>{
            Notifications.hideNotification();

            if(notification_banner.querySelector('.banner_arrow').classList.contains('banner_arrow--show')){
                notification_banner.querySelector('.banner_arrow').classList.remove("banner_arrow--show")
            }
        },5000);
    }
    static hideNotification(){
        notification_banner.style.transform = "translateX(100%)"
    }
}


module.exports = Notifications;