"use strict";

const TableController = require("../utilities/TableController");


class Modal {

    static openPrompt(itemName, resolve, reject){

        console.log(resolve, reject);

        // return new Promise((resolve,reject)=>{


                    const newDialog = 
                `
                    <div class="dialogContainer fullwidth aDialog" role="container">
                        <div class="dialogHeader" role="header">

                            <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
                            <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />

                        </div>

                        <div class="dialogBody fullwidth" role="body">
                        <span>
                                Please Enter Your Password To Continue
                            </span>

                            <input type="password" class="modal_pass" aria-placeholder="enter password here" placeholder="Enter Your Password Here" />

                        </div>

                        <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                            <div class="dialogConfirm">
                                Confirm
                            </div>
                        </div>

                    </div>
                `

                const promptBox = document.createElement('div');
                promptBox.className = "modal dialog--promptBox";
                promptBox.setAttribute("aria-placeholder", "Prompt Box");

                promptBox.innerHTML = newDialog;

                const mainBodyContent = document.querySelector('.mainBody_content')


                mainBodyContent.appendChild(promptBox);


                //Event Listener
                promptBox.querySelector('.img_close').addEventListener("click",()=>{closePromptBox(resolve, reject)})

                promptBox.querySelector('.dialogConfirm').addEventListener("click", ()=>{
                    confirmRemove(itemName, resolve, reject)
                })



            
        // })

        


    }

   

    //Confirmation DialogBox
    static openConfirmationBox(itemName, itemCount){

        return new Promise((resolve, reject)=>{
            const newDialog = 
            `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
                        <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
                    </div>
    
                    <div class="dialogBody fullwidth" role="body">
                       <span>
                                Are You Sure You Want To Delete ${itemName} which has 
                                a quantity of (${itemCount}) from the Inventory.
                        </span>
    
                    </div>
    
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Yes, Delete
                        </div>
                        <div class="dialogRevert">
                            Review Selection
                        </div>
                    </div>
    
                </div>
            `
    
            const confirmationBox = document.createElement('div');
            confirmationBox.className = "modal dialog--confirmationBox";
            confirmationBox.setAttribute("aria-placeholder", "Confirm Box");
    
            confirmationBox.innerHTML = newDialog;
    
            const mainBodyContent = document.querySelector('.mainBody_content')
    
            document.querySelector('.contentCover').classList.add('contentCover--shown')
    
            mainBodyContent.appendChild(confirmationBox);
    
    
            //Event Listener
            confirmationBox.querySelector('.img_close').addEventListener("click",()=>closeConfirmationBox(resolve, reject))
            confirmationBox.querySelector(".dialogRevert").addEventListener("click", ()=>closeConfirmationBox(resolve, reject))
            confirmationBox.querySelector(".dialogConfirm").addEventListener("click", ()=>{
                openPrompt(itemName, resolve, reject)
            })
        })
       
    }

    
    
}

///Event Listener Functions
function closeConfirmationBox(resolve, reject){
    if(mainBodyContent.querySelector('.modal') !== null){

       // document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
       // document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)

        mainBodyContent.querySelector('.modal').remove();
        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        resolve()
    }
        
}

//For Confirmation Box
function openPrompt(itemName, resolve, reject){

    if(mainBodyContent.querySelector('.modal') !== null){

        //document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
        //document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)

        mainBodyContent.querySelector('.modal').remove();
    }


    Modal.openPrompt(itemName, resolve, reject);
}


//For Prompt bOX
function closePromptBox(resolve, reject){
    if(mainBodyContent.querySelector('.modal') !== null){

        mainBodyContent.querySelector('.modal').remove();

        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        resolve()
        
    }
}

function confirmRemove(itemName, resolve, reject){

        console.log(itemName);

        const Password = document.querySelector('.dialog--promptBox').querySelector(".modal_pass").value;

        if(Password === "Samuel"){
            mainBodyContent.querySelector('.modal').remove();

            document.querySelector('.contentCover').classList.remove('contentCover--shown')

            TableController.removeItem(itemName)

            resolve()
        }

}

export default Modal;