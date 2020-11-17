"use strict";

import DATABASE from "../../model/DATABASE";
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
    static openConfirmationBox(itemName, itemCount, action, customMessage=""){

        return new Promise((resolve, reject)=>{

            let Message;

            if(action === "delete"){
                Message = `This action will cause ${itemName} of quantity ${itemCount} to be removed from the shop front. Do you wish to continue?`
            }
            else if(action === "recover"){
                Message = `This action will cause ${itemName} of quantity ${itemCount} to be recovered to the shop front. Do you wish to continue?`
            }

            if(customMessage !== ""){
                Message = customMessage
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
                                ${Message}
                        </span>
    
                    </div>
    
                    <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                        <div class="dialogConfirm">
                            Yes, Continue
                        </div>
                        <div class="dialogRevert">
                            No, Review Selection
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
                closeModal(confirmationBox)
               

                    resolve("confirmed")

            })
        })

    }


/************************************************************************************************************************************************************************/  
 

    static openItemForm(row="", editForm){

        return new Promise((resolve, reject)=>{


            let formTitle;
            let disableField

            if(editForm === true){
                formTitle = "Edit Stock"
                disableField = "disabled";
                
            }
            else{
                formTitle = "New Stock"
                disableField = "";
            }

            let itemName = "";
            let brand  =  ""
            let category = ""
            let itemQuantity = ""
            let sellingPrice = ""
            let costPrice = ""
            let discount = ""

           

            if(row !==""){
    
                itemName = row.querySelector(".td_Names").innerText;
                brand  =  row.querySelector(".td_Brands").innerText;
                category = row.querySelector(".td_Category").innerText;
                itemQuantity = row.querySelector(".td_Stock").innerText;
                sellingPrice = row.querySelector(".td_Price").innerText;
                costPrice = row.querySelector(".td_costPrice").innerText
                discount = row.querySelector(".td_discount").innerText
            }
            
            const boxTemplate = 
            `
                <div class="dialogContainer fullwidth aDialog" role="container">
                    <div class="dialogHeader" role="header">
    
                        ${formTitle}    
    
                        <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />
    
                    </div>
    
                    <form class="dialogBody fullwidth" role="body">
    
                            <input type="text" class="dialogForm_tb fullwidth" ${disableField} value="${itemName}" aria-placeholder="Item Name" placeholder="Item Name" id="name" />
    
                         <div class="flexContainer">   
                            <select class="dialogForm_tb halfwidth" ${disableField} value="${category}" aria-placeholder="Item Category" placeholder="Item Category" id="category" ></select>
    
                            <select class="dialogForm_tb halfwidth" ${disableField} value="${brand}" aria-placeholder="Item Brand" placeholder="Item Brand" id="brand"></select>
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${itemQuantity}" aria-placeholder="Total in inventory" placeholder="Total In Inventory" id="total" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(costPrice)}" aria-placeholder="Cost Price" placeholder="Cost Price (GH₵)" id="costPrice" />
    
                            <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(sellingPrice)}" aria-placeholder="Unit Cost" placeholder="Selling Price (GH₵)" id="sellingPrice" />

                            <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(discount)}" aria-placeholder="Discount(%)" placeholder="Discount(%)" id="discount" />
    
                         </div>

                         <datalist id="categoryList">
                          
                         </datalist>

                         <datalist id="brandList">
                          
                         </datalist>
    
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
                

                 //Intializing DataLists

                 const db = new DATABASE();
                
                 //Category
                 db.getAllItemCategories()
                 .then((categories)=>{


                    const categorySelect =itemForm.querySelector("#category");

                    let placeholder = document.createElement("option");
                    placeholder.value = null;
                    placeholder.innerText = "---Choose Product Category---";
                    placeholder.disabled = true;
                    categorySelect.appendChild(placeholder)
 
                    categories.forEach((item)=>{
    
                        let newOption = document.createElement("option");
                        newOption.value = item.Name;
                        newOption.innerText = item.Name;
    

                        if(item.Name === category){

                            itemForm.querySelector("#category").replaceChild(newOption, placeholder)
                            
                        }
                        else{

                            itemForm.querySelector("#category").appendChild(newOption);

                        }
                        
    
                    })

                    let newOption = document.createElement("option");
                    newOption.value = null;
                    newOption.innerText = "Create a new category";
                    categorySelect.appendChild(newOption);

                    //Deselecting 
                    categorySelect.selectedIndex = "0";

                    categorySelect.addEventListener("change", function changeToTextBox(e){

                        if(categorySelect.selectedIndex === categorySelect.length -1){

                            e.preventDefault();

                            const newTextBox = document.createElement("input");
                            newTextBox.setAttribute("type", "text");
                            newTextBox.placeholder = "Type in your new category"

                            newTextBox.className = "dialogForm_tb halfwidth";
                            newTextBox.id = "category"

                            itemForm.querySelector("form").querySelector(".flexContainer").replaceChild(newTextBox, categorySelect)


                        }

                    })



                 })

                 
                 //Brands
                 db.getAllItemBrands()
                 .then((brands)=>{


                    const brandSelect =itemForm.querySelector("#brand");

                    let placeholder = document.createElement("option");
                    placeholder.value = null;
                    placeholder.innerText = "---Choose Product Brand---";
                    placeholder.disabled = true;
                    brandSelect.appendChild(placeholder)


                    brands.forEach((item, itemIndex)=>{
    
                        let newOption = document.createElement("option");
                        newOption.value = item.Name;
                        newOption.innerText = item.Name; 

                        if(item.Name === brand){

                            brandSelect.replaceChild(newOption, placeholder)
                            
                        }
                        else{

                            brandSelect.appendChild(newOption);

                        }
                        
    
                    })


                    let newOption = document.createElement("option");
                    newOption.value = null;
                    newOption.innerText = "Create a new brand";
                    brandSelect.appendChild(newOption);

                    //Deselecting 
                    brandSelect.selectedIndex = "0";




                    brandSelect.addEventListener("change", function changeToTextBox(e){

                        if(brandSelect.selectedIndex === brandSelect.length -1){

                            e.preventDefault();

                            const newTextBox = document.createElement("input");
                            newTextBox.setAttribute("type", "text");
                            newTextBox.placeholder = "Type in your new brand"

                            newTextBox.className = "dialogForm_tb halfwidth";
                            newTextBox.id = "brand"

                            itemForm.querySelector("form").querySelector(".flexContainer").replaceChild(newTextBox, brandSelect)


                        }

                    })


                 })
 
    
                
                //Event Listeners
                itemForm.querySelector('.img_close').addEventListener("click",exitBox);

                itemForm.querySelector('.dialogConfirm').addEventListener("click", saveFormData);

                function saveFormData(){

                    //Form Data
                    const name = itemForm.querySelector('#name').value;
                    const category = itemForm.querySelector('#category').value;
                    const brand = itemForm.querySelector('#brand').value;
                    const stock = itemForm.querySelector('#total').value;
                    const sellingPrice = itemForm.querySelector('#sellingPrice').value;
                    const costPrice = itemForm.querySelector("#costPrice").value;

                    discount = itemForm.querySelector('#discount').value

                    // console.log(name, category, brand, stock, price);

                    if(name !== "" && category !== "" && brand !== "" && stock !== "" && sellingPrice !== ""){


                        closeModal(itemForm);

                        // openPrompt("",resolve,reject, [true, row, name, brand, category, stock, sellingPrice])

                        resolve([true, row, name, brand, category, stock, sellingPrice, costPrice, discount]);


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
                            <div class="itemInfo" id="costSection"><span>Gh¢ <span id="cost"> ${parseFloat(item.amountPurchased * item.price).toFixed(2)}</span></span></div>
                            <div class="delItem"> <img src="../Icons/Modals/closeWhite.svg" alt="delete" /> </div>
                        `
                        let newRow = document.createElement('div');
                        newRow.className = "modalItem";
                        newRow.innerHTML = itemTemplate;

                        //Delete Event Listener
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

                        const sellBtnIco =  itemForm.querySelector(".dialogConfirm").querySelector('img')
                        sellBtnIco.setAttribute("src", "../../utils/media/animations/loaders/Rolling-1s-200px.svg")

                        const db = new DATABASE();

                        let promises = [];

                        cart.forEach((item)=>{

                            promises.push(

                                new Promise((resolve, reject)=>{

                                    db.getItemStock({Name: item.name, Brand: item.brand})
                                    .then((totalStock)=>{

                                        totalStock = totalStock - parseInt(item.amountPurchased);

                                        db.updateItemStock({Name: item.name, Brand: item.brand}, totalStock.toString())
                                        .then(()=>{
                                            resolve()
                                        })

                                    })


                                })

                            )

                        })

                        Promise.all(promises)
                        .then(()=>{

                            cartCount.innerText = '0'
                            cartCount.style.transform = "scale(0)"
                            
                            cart.forEach((item)=>{

                                TableController.uncheckRows(item.name, item.brand)

                            })

                            exitBox()

                            resolve(totalPrice);

                        })


                    }

                    //Function called to close modal
                    function exitBox(){

                        closeModal(itemForm)

                        document.querySelector('.contentCover').classList.remove('contentCover--shown')

                    }

                    // Function called to remove items (divs) in cart
                    function removeItem(e){

                        // Animating item (slide right)
                        e.target.parentElement.parentElement.style.transform = 'translateX(100%)'
                        


                        //Remove element after animation
                        setTimeout(()=>{

                            e.target.parentElement.parentElement.remove();

                            let name = e.target.parentElement.parentElement.querySelector('#name').innerText;
                            let brand = e.target.parentElement.parentElement.querySelector('#brand').innerText;

                            totalSelectedRows = totalSelectedRows -1;

                            //Modifying span on checkout box
                            cartCount.innerText = totalSelectedRows;

                            if(totalSelectedRows === 0){
                                cartCount.style.transform = "scale(0)"
                            }

                            //Uncheking Corresponding row in table
                            TableController.uncheckRows(name, brand)

                            
                            //Subtracting prices of removed items from main total cost
                            let itemPrice = e.target.parentElement.parentElement.querySelector('#costSection').querySelector('#cost').innerText;

                            itemPrice = parseFloat(itemPrice);

                            totalPrice = totalPrice - itemPrice;

                            console.log(totalPrice, " ", itemPrice);

                            itemForm.querySelector('#lblPrice').innerHTML = `<b>Gh¢ ${UnitConverter.convert(totalPrice)} </b>`;


                            /****Removing item from cart array****/
                            // For each item in cart array
                            cart.forEach((item)=>{


                                let currentItemIndex;
                    
                                //If 
                                if(item.name === name && item.brand === brand){
                    
                                    currentItemIndex = cart.indexOf(item);
                    
                                    cart.splice(currentItemIndex, 1)
                    
                    
                                }
                            })

                            // If cart is empty
                            if(cart.length === 0){
                                //Close modal
                                closeModal(itemForm)

                                // Disable Submit Button
                                const footer_btn = document.querySelector('.footer_btn');
                                footer_btn.disabled = true
                            }

                            resolve();
                            

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

//Function called to reomve modal
function closeModal(modal){

    return new Promise((resolve, reject)=>{

        if(!modal.classList.contains("dialog--shown")){
            modal.classList.add('modal_hide');
   
       }
   
       modal.classList.remove('dialog--shown');
       document.querySelector(".contentCover").classList.remove("contentCover--shown")

   
       //Remove modal from DOM after animation
       setTimeout(()=>{
           modal.remove();
       },400);

       resolve()

    })

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