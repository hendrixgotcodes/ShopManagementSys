const { shell } = require("electron");

/***********AUDIO FILES*********/
// const winAlert = new Audio('../../utils/media/syssounds/win10.mp3')

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


        shell.beep();

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

    static showAlert(messageType, message){

        return new Promise((resolve, reject)=>{

            const mainBodyContent = document.querySelector(".mainBody_content");

            messageType = messageType.toLowerCase();
    
            let bGColor;
    
            switch (messageType){
                case 'success':
                    bGColor = "#12A89D";
                    break;
    
                case 'warning':
                    bGColor = "#E17C38";
                    break;
    
                case 'error':
                    bGColor = " #ce2727";
                    break;
    
                default:
                    bGColor = "#12A89D"
            }
    
            let alertTemplate = 
            `
                <img class="img_close" src="../Icons/Modals/closeWhite.svg" alt="Close Modal" />
                <div class="alertContent">
                    ${message}
                </div>
            `
    
            let alert = document.createElement("div");
            alert.innerHTML = alertTemplate;
            alert.className = "alertBanner";
            alert.style.backgroundColor = bGColor;
    
    
           (function Animate(){
               return new Promise((resolve, reject)=>{
                        mainBodyContent.appendChild(alert);
                        resolve();
               })
           })().then(()=>{
    
                setTimeout(() => {
    
                    mainBodyContent.querySelector(".alertBanner").classList.add("alertBanner--shown")
                    resolve()
                    
                }, 300)
    
                //Automatically remove after three seconds
                setTimeout(()=>{
    
                    (
                        function Animate(){
                            return new Promise((resolve, reject)=>{
    
                                mainBodyContent.querySelector(".alertBanner").classList.remove("alertBanner--shown")
                                
                                // function will resolve after animation is document (animation takes .5s, function resolves after .6s)
                                setTimeout(() => {
                                    resolve()
                                }, 600);
                            })
                        }
                    )()
                    .then(
                        ()=>{
    
                            //Removing alertbanner from DOM to increase performance
                            mainBodyContent.querySelector(".alertBanner").remove();
                            
                        }
                    )
    
                }, 5000)   
    
    
           })
    
            

        })


    }
}


module.exports = Notifications;