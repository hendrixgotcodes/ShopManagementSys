"use strict";

const TableController = require("../utilities/TableController");


class Modal {

    static openPrompt(itemName, resolve, reject, item=""){

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
                    confirmRemove(itemName, resolve, reject, item)      //ItemName and Item are basically the same but kinda acts as flags to polymorphism of this function
                });


        


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

                    if(name !== "" || category !== "" || brand !== "" || stock !== "" || price !== ""){

                        TableController.editItem(row, name, brand, category, stock, price);

                        closeModal(itemForm);

                        let relsolved = openPrompt("",resolve,reject, name)

                        

                        relsolved(["edited", name])

                        // closeConfirmationBox(resolve, reject, true, name)                        

                    }
                  
                }

                function exitBox(){
                    closeConfirmationBox(resolve, reject)
                }
            


        })

        

    }

    
    
}

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
function openPrompt(itemName, resolve, reject, item=""){

    if(mainBodyContent.querySelector('.modal') !== null){

        //document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
        //document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)

        mainBodyContent.querySelector('.modal').remove();
    }


    Modal.openPrompt(itemName, resolve, reject, item)
    .then(
        ()=>{
            resolve();
        }
    );
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
function confirmRemove(itemName, resolve, reject, name=""){

        const modal =  mainBodyContent.querySelector('.modal');


        const Password = document.querySelector('.dialog--promptBox').querySelector(".modal_pass").value;

        if(Password === "Samuel"){

            closeModal(modal);
           

            document.querySelector('.contentCover').classList.remove('contentCover--shown')


            resolve ()

            TableController.removeItem(itemName)

            resolve("removed")
        }
        else{
            reject(new Error("wrongPassword"))

            closeModal(modal)

            document.querySelector('.contentCover').classList.remove('contentCover--shown')
            
        }

}


function closeModal(modal){
    modal.classList.add('modal_hide');

    setTimeout(()=>{
        modal.remove();
    },400);
}

export default Modal;