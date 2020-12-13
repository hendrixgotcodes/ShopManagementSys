//Imports
const {
    ipcRenderer
} = require('electron');
const ACCOUNTREPORTER = require('../model/ACCOUNTREPORTER.js');
const DATABASE = require('../model/DATABASE');

// const STORE = require('../model/STORE');
const database = new DATABASE();
const lostAccountReporter = new ACCOUNTREPORTER();


//DOM Elements
const main = document.querySelector("body");
const contentCover  = document.querySelector(".contentCover");
const controlBoxMinimize = document.querySelector('.controlBox_minimize');
const controlBoxMaximize = document.querySelector('.controlBox_maximize');
const controlBoxClose = document.querySelector('.controlBox_close');
const restoreMaxi = document.getElementById('restore_maxi');
const formBtn = document.querySelector('.form_btn');
const formCheck = document.querySelector('.form_check');
const tbUserName = document.querySelector('#username');
const tbPassword = document.querySelector('#password');
const visIcon = document.querySelector('.vis_icon');
const btnLoader = document.querySelector(".form_btn > img")
const warningLabel_tb = document.querySelector(".warningLabel_tb");
const warningLabel_pw = document.querySelector(".warningLabel_pw");
const forgottenPassword = document.querySelector(".forgottenPassword");

//Program Variables
let isFullScreen = false;
let verifiedFields = false;
let faileLoginCount = 0;



//Adding event listeners to trigger minimize, maximize and events in the mainWindow Controller
controlBoxMinimize.addEventListener('click', sendMinimizeEvent)
controlBoxMaximize.addEventListener('click', sendMaximizeEvent)
controlBoxClose.addEventListener('click', sendCloseEvent)
formBtn.addEventListener('click', loadStore);
formCheck.addEventListener('click', togglePassVisibility)

tbUserName.addEventListener("blur", function verifyInputValues(){

    if(tbUserName.value === "")
    {
        warningLabel_tb.hidden = false
        verifiedFields = false
    }
    else if(tbUserName.value.replace(/^\s+|\s+$/g, "") === ""){

        warningLabel_tb.innerHTML = `Spaces not allowed here`

        let img = document.createElement("img")
        img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
        img.className = "ico_form"
        warningLabel_tb.appendChild(img)

        warningLabel_tb.hidden = false
        verifiedFields = false

    }
    else{
        warningLabel_tb.hidden = true
        warningLabel_tb.querySelector(".ico_form").remove()


        verifiedFields = true
    }

})

tbPassword.addEventListener("blur", function verifyInputValues(){

    if(tbPassword.value === "")
    {
        warningLabel_pw.hidden = false
        verifiedFields = false
    }
    else if(tbPassword.value.replace(/^\s+|\s+$/g, "") === ""){

        warningLabel_pw.innerText = `Spaces not allowed here`;

        let img = document.createElement("img")
        img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
        img.className = "ico_form"

        warningLabel_pw.appendChild(img)


        warningLabel_pw.hidden = false;
        verifiedFields = false;

    }
    else{
        warningLabel_pw.hidden = true;
        verifiedFields = true;

        warningLabel_pw.querySelector(".ico_form").remove()
    }

})

tbUserName.addEventListener("keyup", function(e){

    if(e.key == " "){
        e.preventDefault()

        warningLabel_tb.innerText = `Spaces not allowed here`

        let img = document.createElement("img")
        img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
        img.className = "ico_form"
        warningLabel_tb.appendChild(img)

        warningLabel_tb.hidden = false

    }

})

tbPassword.addEventListener("keyup", function(e){

    if(e.key === " "){
        e.preventDefault()

        warningLabel_pw.innerText = `Spaces not allowed here`

        let img = document.createElement("img")
        img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
        img.className = "ico_form"
        warningLabel_pw.appendChild(img)

        warningLabel_pw.hidden = false

    }
    if(e.key === "Enter"){
        loadStore(e)
    }

})

contentCover.addEventListener("click", ()=>{

    closeConfirmationBox();

})

forgottenPassword.addEventListener("click", function loadPasswordHelpCenter(e){

    e.preventDefault();

    contentCover.classList.add("contentCover--shown");

    loadConfirmationBox()

})

function loadConfirmationBox(){

    const confirmationBoxInnerTemplate = 
    `
        <header class="mainHeader">Confirm</header>

        <form class="mainForm">
        
            <label class="confirmationLabel" for="confirmationBox">

                A report will be sent to your administrator to reset your password.
                Do you wish to continue with this process?
            
            </label>

            <button class="btnConfirm">Yes</button>

        </form>
    `
    const confirmationBox = document.createElement("div");
    confirmationBox.className = "confirmationBox";

    confirmationBox.innerHTML = confirmationBoxInnerTemplate;

    main.appendChild(confirmationBox)

    const btnConfirm = main.querySelector(".btnConfirm")

    btnConfirm.addEventListener("click", (e)=>{

        e.preventDefault()

        database.setReportedAccount(tbUserName.value)
        .then(()=>{

            closeConfirmationBox();

            forgottenPassword.classList.remove("forgottenPassword--shown");

        })
        
        

       

    })

    function closeConfirmationBox(){

        const confirmationBox = main.querySelector(".confirmationBox");

        if(confirmationBox !== null){

            contentCover.classList.remove("contentCover--shown");
            confirmationBox.remove(); 

        }

    }

}

/*________________________________________________________________________________________*/





//Event Listeners From IPC
ipcRenderer.on('isFullScreen', () => {
    restoreMaxi.setAttribute('src', "../Icons/Control_Box/Restore.png")
    isFullScreen = true
})


/***********************Functions Being Called/********************************* */
function sendMinimizeEvent() {
    ipcRenderer.send('minimize')

}

function sendMaximizeEvent() {
    if (isFullScreen === true) {
        ipcRenderer.send("restore")
        restoreMaxi.setAttribute('src', "../Icons/Control_Box/Maximize.png")
        isFullScreen = false;
    } else {
        restoreMaxi.setAttribute('src', "../Icons/Control_Box/Restore.png")
        isFullScreen = true
        ipcRenderer.send('maximize')
    }

}

function sendCloseEvent() {
    ipcRenderer.send('close')
}

function loadStore(e) {

    if(verifiedFields === true){

        btnLoader.setAttribute("src", "../../utils/media/animations/loaders/Infinity-1s-200px.svg")
        btnLoader.classList.add("img_shown")


        database.validateUser(tbUserName.value, tbPassword.value)
        .then((result)=>{



            if(result[1] === "Admin"){

                    ipcRenderer.send('loadStore', [result[0], "Admin"]);

            }
            else if(result[1] === "Employee"){
                ipcRenderer.send("loadStore", [result[0], "Employee"])
            }

        })
        .catch((error)=>{

            btnLoader.removeAttribute("src")
            btnLoader.classList.remove("img_shown")

            console.log(error.code);

            if(error === "incorrect username"){

                warningLabel_tb.innerText = `Incorrect username`;
                let img = document.createElement("img")
                img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
                img.className = "ico_form"
                warningLabel_tb.appendChild(img)

                warningLabel_tb.hidden = false

                tbUserName.value = "";
                tbPassword.value = "";

            }
            else if(error === "incorrect password"){

                warningLabel_pw.innerText = `Incorrect password`

                let img = document.createElement("img")
                img.setAttribute("src", "../Icons/form/arrow_pointer.svg");
                img.className = "ico_form"
                warningLabel_pw.appendChild(img)

                warningLabel_pw.hidden = false

                tbPassword.value = "";

                faileLoginCount = faileLoginCount + 1;


                if(faileLoginCount === 3){


                    forgottenPassword.classList.add("forgottenPassword--shown");

                }

            }


        })

        
    }



   

}

//Function to toggle password visibility
function togglePassVisibility() {

    if (formCheck.checked == true) {
        tbPassword.type = 'text'
        visIcon.setAttribute('src', '../Icons/unwatch.svg')

    } else {
        tbPassword.type = 'password'
        visIcon.setAttribute('src', '../Icons/watch.svg')

    }

}

