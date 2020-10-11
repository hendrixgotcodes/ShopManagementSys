/**********DOM ELEMENTS*********/
const notification_banner = document.querySelector('.notification_banner');

class Notifications{
    static showNotification(message){
        notification_banner.querySelector('span').innerText = message
        notification_banner.style.transform = "translateX(0%)"
    }
    static hideNotification(){
        notification_banner.style.transform = "translateX(100%)"
    }
}


module.exports = Notifications;