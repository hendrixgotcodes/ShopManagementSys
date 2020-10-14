"use strict";

const TableController = require("../utilities/TableController");


class Modal {

    static openPrompt(itemName, resolve, reject){

        console.log(resolve, reject);


                    const boxTemplate = 
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

                promptBox.innerHTML = boxTemplate;

                const mainBodyContent = document.querySelector('.mainBody_content')


                mainBodyContent.appendChild(promptBox);


                //Event Listener
                promptBox.querySelector('.img_close').addEventListener("click",()=>{closePromptBox(resolve, reject)})

                promptBox.querySelector('.dialogConfirm').addEventListener("click", ()=>{
                    confirmRemove(itemName, resolve, reject)
                })


        


    }

   

    //Confirmation DialogBox
    static openConfirmationBox(itemName, itemCount){

        return new Promise((resolve, reject)=>{
            const boxTemplate = 
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
    
            confirmationBox.innerHTML = boxTemplate;
    
            const mainBodyContent = document.querySelector('.mainBody_content')

            mainBodyContent.appendChild(confirmationBox);

    
            document.querySelector('.contentCover').classList.add('contentCover--shown')

            setTimeout(()=>{
                    mainBodyContent.querySelector(".dialog--confirmationBox").classList.add("dialog--confirmationBox--shown")
            }, 100)
    
    
    
            //Event Listener
            confirmationBox.querySelector('.img_close').addEventListener("click",()=>closeConfirmationBox(resolve, reject))
            confirmationBox.querySelector(".dialogRevert").addEventListener("click", ()=>closeConfirmationBox(resolve, reject))
            confirmationBox.querySelector(".dialogConfirm").addEventListener("click", ()=>{
                openPrompt(itemName, resolve, reject)
            })
        })

    }

    static openItemForm(row, editForm){

        return new Promise((resolve, reject)=>{


            let formTitle = editForm === true ?  "Edit Stock" : "New Stock";

            const itemName = row.querySelector(".td_Names").innerText;
            const brand  =  row.querySelector(".td_Brands").innerText;
            const category = row.querySelector(".td_Category").innerText;
            const itemQuantity = row.querySelector(".td_Stock").innerText;
            const sellingPrice = row.querySelector(".td_Price").innerText;
    
            const boxTemplate = 
            `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
    
                        ${formTitle}    
    
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
    
                    </div>
    
                    <form class="dialogBody fullwidth" role="body">
    
                            <input type="text" class="dialogForm_tb fullwidth" value=${itemName} aria-placeholder="Item Name" placeholder="Item Name" id="name" />
    
                         <div class="flexContainer">   
                            <input type="text" class="dialogForm_tb halfwidth" value=${category} aria-placeholder="Item Category" placeholder="Item Category" id="category" />
    
                            <input type="text" class="dialogForm_tb halfwidth" value=${brand} aria-placeholder="Item Brand" placeholder="Item Brand" id="brand" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value=${itemQuantity} aria-placeholder="Total in inventory" placeholder="Total In Inventory" id="total" />
    
                            <input type="number" class="dialogForm_tb halfwidth" aria-placeholder="Cost Price" placeholder="Cost Price" id="costPrice" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value=${sellingPrice} aria-placeholder="Unit Cost" placeholder="Selling Price" id="sellingPrice" />
    
                         </div>
    
                    </form>
    
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Save
                            <img src="../Icons/Modals/add.svg" alt="Confirmation Message" />
                        </div>
                    </div>
    
                </div>
            `
    
            const itemForm = document.createElement('div');
                itemForm.className = "modal dialog--itemFormBox";
                itemForm.classList.add("dialog--promptBox")
                itemForm.setAttribute("aria-placeholder", "Confirm Box");
        
                itemForm.innerHTML = boxTemplate;
        
                const mainBodyContent = document.querySelector('.mainBody_content');
    
                mainBodyContent.appendChild(itemForm);
    
        
                document.querySelector('.contentCover').classList.add('contentCover--shown')
    
                setTimeout(()=>{
                        mainBodyContent.querySelector(".dialog--itemFormBox").classList.add("dialog--shown")
                }, 100)
    
    
                itemForm.querySelector('.img_close').addEventListener("click",()=>closeConfirmationBox(resolve, reject))
            


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

// Validates password provided in prompt box and removes removes specified element
function confirmRemove(itemName, resolve, reject){

        console.log(itemName);

        const Password = document.querySelector('.dialog--promptBox').querySelector(".modal_pass").value;

        if(Password === "Samuel"){
            mainBodyContent.querySelector('.modal').remove();

            document.querySelector('.contentCover').classList.remove('contentCover--shown')

            TableController.removeItem(itemName)

            resolve("removed")
        }
        else{
            reject(new Error("wrongPassword"))
        }

}

export default Modal;