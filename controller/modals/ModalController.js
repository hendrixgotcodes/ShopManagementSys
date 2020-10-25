"use strict";

import { showAlert } from "../Alerts/NotificationController";
import UnitConverter from "../utilities/UnitConverter";

const TableController = require("../utilities/TableController");


class Modal {

    static openPrompt(itemName="", resolve, reject, justVerify="", customMessage=""){

        let defaultMessage = "Please Enter Your Password To Continue";

        if(customMessage !== ""){
                defaultMessage = customMessage;
        }


                    const boxTemplate = 
                `
                    <div class="dialogContainer fullwidth aDialog" role="container">
                        <div class="dialogHeader" role="header">

                            <img src="../Icons/Modals/question.svg" alt="Confirmation Message" />
                            <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />

                        </div>

                        <div class="dialogBody fullwidth" role="body">
                        <span>
                                ${defaultMessage}
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

               
                openModal(promptBox);
                


                //Event Listener
                promptBox.querySelector('.img_close').addEventListener("click",()=>{closePromptBox(promptBox, resolve, reject)})

                promptBox.querySelector('.dialogConfirm').addEventListener("click", ()=>{
                    confirmRemove(itemName, resolve, reject, justVerify)      //ItemName and Item are basically the same but kinda acts as flags to polymorphism of this function
                });


        


    }

/************************************************************************************************************************************************************************/  

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


/************************************************************************************************************************************************************************/  
 

    static openItemForm(row="", editForm){

        return new Promise((resolve, reject)=>{


            let formTitle = editForm === true ?  "Edit Stock" : "New Stock";

            let itemName = "";
            let brand  =  ""
            let category = ""
            let itemQuantity = ""
            let sellingPrice = ""

           

            if(row !==""){
    
                itemName = row.querySelector(".td_Names").innerText;
                brand  =  row.querySelector(".td_Brands").innerText;
                category = row.querySelector(".td_Category").innerText;
                itemQuantity = row.querySelector(".td_Stock").innerText;
                sellingPrice = row.querySelector(".td_Price").innerText;
            }
            
            const boxTemplate = 
            `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
    
                        ${formTitle}    
    
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
    
                    </div>
    
                    <form class="dialogBody fullwidth" role="body">
    
                            <input type="text" class="dialogForm_tb fullwidth" value="${itemName}" aria-placeholder="Item Name" placeholder="Item Name" id="name" />
    
                         <div class="flexContainer">   
                            <input type="text" class="dialogForm_tb halfwidth" value="${category}" aria-placeholder="Item Category" placeholder="Item Category" id="category" />
    
                            <input type="text" class="dialogForm_tb halfwidth" value="${brand}" aria-placeholder="Item Brand" placeholder="Item Brand" id="brand" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${itemQuantity}" aria-placeholder="Total in inventory" placeholder="Total In Inventory" id="total" />
    
                            <input type="number" class="dialogForm_tb halfwidth" aria-placeholder="Cost Price" placeholder="Cost Price" id="costPrice" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${sellingPrice}" aria-placeholder="Unit Cost" placeholder="Selling Price" id="sellingPrice" />
    
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
                
    
                
                //Event Listeners
                itemForm.querySelector('.img_close').addEventListener("click",exitBox);

                itemForm.querySelector('.dialogConfirm').addEventListener("click", saveFormData);

                function saveFormData(){

                    //Form Data
                    const name = itemForm.querySelector('#name').value;
                    const category = itemForm.querySelector('#category').value;
                    const brand = itemForm.querySelector('#brand').value;
                    const stock = itemForm.querySelector('#total').value;
                    const price = itemForm.querySelector('#sellingPrice').value;

                    console.log(name, category, brand, stock, price);

                    if(name !== "" && category !== "" && brand !== "" && stock !== "" && price !== ""){


                        closeModal(itemForm);

                        openPrompt("",resolve,reject, [true, row, name, brand, category, stock, price])


                    }
                  
                }

                function exitBox(){
                    closeConfirmationBox(resolve, reject)
                }
            


        })

        

    }


/************************************************************************************************************************************************************************/ 


    static createCheckout(cart, totalSelectedRows, cartCount){

        return new Promise((resolve, reject)=>{

            let totalPrice = 0;

                        
            cart.forEach((item)=>{
                totalPrice +=  parseFloat(item.price * item.amountPurchased)
            })

            totalPrice = parseFloat(totalPrice).toFixed(2)

            const formTemplate = 
            `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">

                        <span>In Cart</span>

                        <span id="lblPrice"> <b>Gh¢ ${UnitConverter.convert(totalPrice)} </b></span>
                        
                    </div>

                    <div class="scrollBox">

                    </div>

                
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Sell
                            <img src="../Icons/Modals/add.svg" alt="Confirmation Message" />
                        </div>
                    </div>

                </div>
                    
            `

            const itemForm = document.createElement('div');
                    itemForm.className = "modal dialog--cartForm";
                    itemForm.classList.add("dialog--promptBox")
                    itemForm.setAttribute("aria-placeholder", "Confirm Box");
                    itemForm.setAttribute('tabindex', '1');
            
                    itemForm.innerHTML = formTemplate;
            
                    const mainBodyContent = document.querySelector('.mainBody_content');

                    // mainBodyContent.appendChild(itemForm);

                    openModal(itemForm)

                    //Giving focus to form immediately after its added to the DOM
                    itemForm.focus();

            
                    document.querySelector('.contentCover').classList.add('contentCover--shown')

                    setTimeout(()=>{
                            mainBodyContent.querySelector(".dialog--cartForm").classList.add("dialog--shown")
                    }, 100)


                    //Adding Items to List

                    let scrollBox = itemForm.querySelector('.scrollBox');

                    cart.forEach((item)=>{

                        let itemTemplate = 
                        `
                            <div class="itemInfo" id="name"><span>${item.name}</span></div>
                            <div class="itemInfo" id="brand"><span>${item.brand}</span></div>
                            <div class="itemInfo" id="amount"><span>x${item.amountPurchased}</span></div>
                            <div class="itemInfo" id="cost"><span>Gh¢ ${parseFloat(item.amountPurchased * item.price).toFixed(2)}</span></div>
                            <div class="delItem"> <img src="../Icons/Modals/closeWhite.svg" alt="delete" /> </div>
                        `
                        let newRow = document.createElement('div');
                        newRow.className = "modalItem";
                        newRow.innerHTML = itemTemplate;

                        newRow.querySelector('.delItem').addEventListener('click',(e)=>{
                            removeItem(e)
                        })

                        scrollBox.appendChild(newRow);

                    })
                    

                    
                    /***************************EVENT LISTENERS*****************************/

                    itemForm.querySelector('.dialogConfirm').addEventListener("click", sellItems);

                    itemForm.addEventListener('blur', exitBox)



                    /***************************FUNCTIONS*****************************/

                    //Sell button function
                    function sellItems(){


                        exitBox()

                        resolve(totalPrice);

                    }

                    //Function called to close modal
                    function exitBox(){

                        closeModal(itemForm)

                        document.querySelector('.contentCover').classList.remove('contentCover--shown')

                    }

                    // Function called to remove items (divs) in cart
                    function removeItem(e){


                        e.target.parentElement.parentElement.style.transform = 'translateX(100%)'
                        


                        //Remove element after animation has been done
                        setTimeout(()=>{

                            e.target.parentElement.parentElement.remove();

                            let name = e.target.parentElement.parentElement.querySelector('#name').innerText;
                            let brand = e.target.parentElement.parentElement.querySelector('#brand').innerText;

                            totalSelectedRows = totalSelectedRows -1;

                            cartCount.innerText = totalSelectedRows;

                            //Uncheking Corresponding row in table
                            TableController.uncheckRows(name, brand)

                        },400)

                    }
                



        })
    }

    
    
}









/*****************************************************************************FUNCTIONS***************************************************************/


///Event Listener Functions
function closeConfirmationBox(resolve, reject, edited="", name=""){
    if(mainBodyContent.querySelector('.modal') !== null){

       // document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
       // document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)
        mainBodyContent.querySelector('.modal').remove();

        
        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        if(edited === true){
            resolve(["edited", name])
        }
        else{
            resolve()
        }

        
    }
    else{
        reject(new Error("Sorry, an error occured"))
    }
        
}

//For Confirmation Box
function openPrompt(itemName, resolve, reject, justVerify=""){

    if(mainBodyContent.querySelector('.modal') !== null){

        //document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
        //document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)

        mainBodyContent.querySelector('.modal').remove();
    }


    Modal.openPrompt(itemName, resolve, reject, justVerify)
}


//For Prompt bOX
function closePromptBox(modal, resolve, reject){
    if(mainBodyContent.querySelector('.modal') !== null){

        // mainBodyContent.querySelector('.modal').remove();
        closeModal(modal);

        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        resolve()
        
    }
}

// Validates password provided in prompt box and removes removes specified element
function confirmRemove(itemName, resolve, reject, justVerify=""){

        const modal =  mainBodyContent.querySelector('.modal');


        const Password = document.querySelector('.dialog--promptBox').querySelector(".modal_pass").value;

        if(Password === "Duffy"){

            closeModal(modal);
           

            document.querySelector('.contentCover').classList.remove('contentCover--shown')

            if(justVerify[0] === true){

                resolve (["edited", justVerify])
                return;
            }


            resolve("verified")
            console.log("removed");
        }
        else{
            reject(new Error("wrongPassword"))

            closeModal(modal)

            document.querySelector('.contentCover').classList.remove('contentCover--shown')
            
        }

}


function closeModal(modal){

    if(!modal.classList.contains("dialog--shown")){
         modal.classList.add('modal_hide');

    }

    modal.classList.remove('dialog--shown');



    setTimeout(()=>{
        modal.remove();
    },400);
}

function openModal(modal){

    // let mainBodyContent= document.querySelector(".main")

    if(!document.querySelector(".contentCover").classList.contains("contentCover--shown")){

        document.querySelector(".contentCover").classList.add("contentCover--shown");

    };

    const mainBodyContent = document.querySelector('.mainBody_content')
    mainBodyContent.appendChild(modal);

    setTimeout(()=>{
        modal.classList.add("dialog--shown");
    },100)


    mainBodyContent.appendChild(modal);


    

}

export default Modal;