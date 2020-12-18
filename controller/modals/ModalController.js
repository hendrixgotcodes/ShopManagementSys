"use strict";

import DATABASE from "../../model/DATABASE";
import Notifications from "../Alerts/NotificationController";
const cryptoJS = require("crypto-js");

const database = new DATABASE()


class Modal {

    static openPrompt(itemName="", resolve, reject, justVerify="", customMessage=""){

        if(document.querySelector("dialog--promptBox") !== null){

            return;

        }

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

    static openExitPrompt(){

        if(document.querySelector(".exitPromptBox") !== null){

            return

        }
        else{

             return new Promise((resolve, reject)=>{

            const contentCover = document.querySelector(".contentCover");
            const contentContainer = document.querySelector(".contentContainer");

            contentCover.classList.add("contentCover--shown");

            const exitPromptBox = document.createElement("div");
            exitPromptBox.className = "exitPromptBox";
            exitPromptBox.innerHTML =
            `
                <header class="header">
                    Signing Out
                </header>

                <center>
                    Please confirm signout.
                </center>

                <footer>
                    <div class="confirm">Confirm</div>
                    <div class="deny">Deny</div>
                </footer>

            `

            contentContainer.appendChild(exitPromptBox);

            setTimeout(()=>{
                exitPromptBox.classList.add("exitPromptBox--shown")
            }, 300)

            const confirm = exitPromptBox.querySelector(".confirm");
            const deny = exitPromptBox.querySelector(".deny");

            /*****************Event Listeners************/
            confirm.addEventListener("click", ()=>{

                contentCover.classList.remove("contentCover--shown");
                exitPromptBox.classList.remove("exitPromptBox--shown");

                setTimeout(()=>{
                    exitPromptBox.remove();
                    resolve();
                }, 500);

            })

            deny.addEventListener("click", ()=>{

                contentCover.classList.remove("contentCover--shown");
                exitPromptBox.classList.remove("exitPromptBox--shown");

                setTimeout(()=>{
                    exitPromptBox.remove();
                    reject();
                }, 500);

            })


        })

        }

       

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
 

    static openItemForm(row="", editForm, inInventory = false){

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
                sellingPrice = row.querySelector(".td_sellingPrice").innerText;
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
    
                        <label id="lbl_name">
                            Name
                            <input type="text" class="dialogForm_tb fullwidth" list="itemList" ${disableField} value="${itemName}" aria-placeholder="Item Name"  id="name" />
                        </label>
    
                         <div class="flexContainer"> 

                            <label class="lbl" id="lbl_category">
                                Category
                                <select class="dialogForm_tb halfwidth" ${disableField} value="${category}" aria-placeholder="Item Category"  id="category" ></select>
                            </label>
    
                            <label class="lbl" id="lbl_brand">
                                Brand
                                <select class="dialogForm_tb halfwidth" ${disableField} value="${brand}" aria-placeholder="Item Brand" " id="brand"></select>
                            </label>
    
                            <label class="lbl" id="lbl_total">
                                Total
                                <input type="number" class="dialogForm_tb halfwidth" value="${itemQuantity}" aria-placeholder="Total in inventory"  id="total" />
                            </label>
    
                            <label class="lbl" id="lbl_costPrice">
                                <span>Cost Price (GH₵)</span>
                                <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(costPrice)}" aria-placeholder="Cost Price" id="costPrice" />
                            </label>
    
                            <label class="lbl" id="lbl_sellingPrice">
                                <span>Selling Price (GH₵)</span>
                                <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(sellingPrice)}" aria-placeholder="Unit Cost"  id="sellingPrice" />
                            </label>

                            <label class="lbl" id="lbl_discount">
                                <span>Discount (%)</span>
                                <input type="number" class="dialogForm_tb halfwidth" value="${parseFloat(discount)}" aria-placeholder="Discount(%)"  id="discount" />
                            </label>
    
                         </div>

                         <datalist id="categoryList">
                          
                         </datalist>

                         <datalist id="brandList">
                          
                         </datalist>

                         <datalist id="itemList">

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

                 //Category
                 database.getAllItemCategories()
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
                 database.getAllItemBrands()
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

                        if(inInventory === true){

                            closeModal(itemForm);

                            // openPrompt("",resolve,reject, [true, row, name, brand, category, stock, sellingPrice])

                            resolve([false, row, name, brand, category, stock, sellingPrice, costPrice, discount]);

                        }
                        else{

                            closeModal(itemForm);

                            // openPrompt("",resolve,reject, [true, row, name, brand, category, stock, sellingPrice])

                            resolve([true, row, name, brand, category, stock, sellingPrice, costPrice, discount]);

                        }


                    }
                  
                }

                function exitBox(){
                    closeConfirmationBox(resolve, reject)
                }


                if(inInventory === true){

                    const name = itemForm.querySelector("#name");
                    const brand = itemForm.querySelector("#brand");
                    const category = itemForm.querySelector("#category");
                    const costPrice = itemForm.querySelector("#costPrice");
                    const sellingPrice = itemForm.querySelector("#sellingPrice");
                    const total = itemForm.querySelector("#total")
                    const discount = itemForm.querySelector("#discount");

                    //Looks up for existing match in database while a user types
                    name.addEventListener("keyup", function lookUpForExistingEntry(){

                        const itemList = itemForm.querySelector("#itemList");

                        database.getItem(name.value)
                        .then((existingItems)=>{

                            existingItems.forEach((item)=>{

                                const newOption = document.createElement("option");
                                newOption.innerText = item.Name;

                                if( itemList.querySelector("option") !== null && itemList.querySelector("option").innerText !== item.Name){

                                    itemList.appendChild(newOption);

                                }
                                else if(itemList.querySelector("option") == null){

                                    itemList.appendChild(newOption);

                                }


                            })

                        })

                    })

                    name.addEventListener("change", function onChanged(){

                        database.getItem(name.value)
                        .then((items)=>{

                            items.forEach((item)=>{

                                name.disabled = true;

                                category.value = item.Category;
                                category.disabled = true;

                                brand.value = item.Brand;
                                brand.disabled = true;

                                costPrice.value = item.CostPrice;
                                sellingPrice.value = item.SellingPrice;
                                total.value = item.InStock;
                                discount.value = item.Discount;

                            })

                        })

                        
                    })

                }

            


        })

        

    }


/************************************************************************************************************************************************************************/ 

                   

    
    static openUserForm(newUser){

        let formTitle, disabled;

        if(newUser === true){

            formTitle = "New Account"
            disabled = " ";

        }
        else{
            formTitle = "Edit Account";
            disabled = "disabled";
        }

        const contentCover = document.querySelector(".contentCover");
        const contentContainer = document.querySelector(".contentContainer");

        contentCover.classList.add("contentCover--shown");

        const userForm = document.createElement("div");
        userForm.className = "userForm modal";

        userForm.innerHTML =
        `
            <header class="userForm_header">
                ${formTitle}

                <img src="../Icons/modals/close.svg"/>
            </header>
            <div class="alertBanner"></div>

            <form>

                <label class="formlbl lbl_FirstName" for="tb_FirstName">

                    First Name
                    <input class="userForm_input tb_firstName" class="tb_FirstName" type="text" placeholder="eg. Adwoa">
                    <span class="alertSpan"></span>

                </label>

                <label class="formlbl lbl_LastName" for="tb_LastName">

                    Last Name
                    <input class="userForm_input tb_lastName" type="text" placeholder="eg. Sarpong">
                    <span class="alertSpan"></span>

                </label>

                <label class="formlbl lbl_UserName" for="tb_UserName">

                    Username
                    <input class="userForm_input tb_UserName" type="text" placeholder="eg. adwoaSar11"/>
                    <span class="alertSpan"></span>

                </label>

                <label class="formlbl lbl_Password" for="tb_Password">

                    Password
                    <input class="userForm_input tb_Password" id="tb_Password" class="form_Password" type="password" placeholder="eg. eightlengthedpassword"/>
                    <span class="alertSpan"></span>

                </label>

                <label class="formlbl lbl_Password" for="tb_PasswordRpt">

                    Confirm Password
                    <input class="userForm_input tb_PasswordRpt" id="tb_PasswordRpt" class="form_Password" type="password" placeholder="eg. repeatpassword"/>
                    <span class="alertSpan"></span>


                </label>

                <label class="formlbl lbl_Password" for="tb_PasswordRpt">

                    Account Type
                   <select class="userForm_input slct_accountType">
                        <option value="0">Regular</option>
                        <option value="1">Administrator</option>
                   </select>
                   <span class="alertSpan"></span>

                </label>


            </form>

            <button class="btn_employ">Employ</button>

        `

        contentContainer.appendChild(userForm);

        const header = userForm.querySelector(".userForm_header");
        const btnClose = header.querySelector("img");
        const btnEmploy = userForm.querySelector(".btn_employ");
        const tb_FirstName = userForm.querySelector(".tb_firstName");
        const tb_LastName = userForm.querySelector(".tb_lastName");
        const tb_Password = userForm.querySelector(".tb_Password");
        const tb_PasswordRpt = userForm.querySelector(".tb_PasswordRpt");
        const slct_accountType = userForm.querySelector(".slct_accountType");
        const tbUserName = userForm.querySelector(".tb_UserName");
        const userForm_inputs = userForm.querySelectorAll(".userForm_input");
        const passwordFields = userForm.querySelectorAll(".form_Password");
        const alertBanner = userForm.querySelector(".alertBanner");

        let pos1,pos2, pos3, pos4 =0;
        let formIsValid = false;


        /***********Event Listeners************/
        header.addEventListener("mousedown",function dragMouseDown(e){

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clentY;

            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                userForm.style.top = (userForm.offsetTop - pos2) + "px";
                userForm.style.left = (userForm.offsetLeft - pos1) + "px";
              }
            
              function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
              }


        })

        btnClose.addEventListener("click", (e)=>{

            userForm.remove();
            contentCover.classList.remove("contentCover--shown")

        });

        btnEmploy.addEventListener("click", (e)=>{

            if(formIsValid === true){

                generateHash(tbUserName.value, tb_PasswordRpt.value)
                .then((hashedPassword)=>{

                    database.addNewUser({
                        First_Name: tb_FirstName.value,
                        Last_Name: tb_LastName.value,
                        User_Name: tbUserName.value,
                        Password: hashedPassword,
                        IsAdmin: slct_accountType.value
                    })
                    .then(()=>{

                        userForm.remove();
                        contentCover.classList.remove("contentCover--shown");

                        Notifications.showAlert("success", "User added successfully");

                    })
                    .catch((error)=>{

                        throw error

                    })

                })

            }
            else{

                alertBanner.classList.add("alertBanner--shown");
                alertBanner.innerText = "Please fill all fields of your form"

                setTimeout(()=>{
                    alertBanner.classList.remove("alertBanner--shown");
                }, 5000);

            }

            

        })

        tbUserName.addEventListener("keyup", (e)=>{

            const alertSpan = tbUserName.parentElement.querySelector(".alertSpan");

            // let tbValue = tbUserName.value.replace(" ","");

            if(e.code === "Space"){

                tbUserName.value = tbUserName.value.replace(" ", "");
                tbUserName.classList.add("error");
                alertSpan.innerText = "No spaces allowed here";
                
                formIsValid = false;

            }
            else{

                formIsValid = true;

                database.getUser(tbUserName.value)
                .then((result)=>{

                    if(tbUserName.classList.contains("error")){
                        tbUserName.classList.remove("error");
                    }

                    alertSpan.innerText = "";

    
                    if(result.length > 0){
    
                        tbUserName.classList.add("error");
                        const alertSpan = tbUserName.parentElement.querySelector(".alertSpan");
                        alertSpan.innerText = "Sorry, username already exists";

                        formIsValid = false;
    
                    }
                    else{
    
                        if(tbUserName.classList.contains("error")){
                            tbUserName.classList.remove("error");
                        }
    
                        alertSpan.innerText = "";

                        formIsValid = true;
    
                    }
    
                })

            }

        });


        userForm_inputs.forEach((userForm_input)=>{

            userForm_input.addEventListener("blur", (e)=>{

                const alertSpan = userForm_input.parentElement.querySelector(".alertSpan");

                if(tbUserName.classList.contains("error")){
                    tbUserName.classList.remove("error");
                }

                alertSpan.innerText = "";

                formIsValid = true;
               

                if(userForm_input.value === "" || userForm_input.value.replace(" ", "") === ""){

                    alertSpan.innerText = "Entry cannot be empty";

                    userForm_input.classList.add("error");

                    formIsValid = false;

                }
                else{

                    if(tbUserName.classList.contains("error")){
                        tbUserName.classList.remove("error");
                    }

                    alertSpan.innerText = "";

                    formIsValid = true;

                }

            })

        })

        passwordFields.forEach((passwordField)=>{

            passwordField.addEventListener("keyup", (e)=>{

                const alertSpan = passwordField.parentElement.querySelector(".alertSpan");

                if(e.code === "Space"){

                    passwordField.value = passwordField.value.replace(" ", "");
                    passwordField.classList.add("error");
                    alertSpan.innerText = "No spaces allowed here";
                    
                    formIsValid = false;

                }
                else{

                    if(passwordFields.classList.contains("error")){
                        passwordField.classList.remove("error");
                    }

                    alertSpan.innerText = "";

                    formIsValid = true;

                }

            })

        })

        tb_PasswordRpt.addEventListener("blur", (e)=>{

            const alertSpan = tb_PasswordRpt.parentElement.querySelector(".alertSpan");

            if(tb_Password.value !== tb_PasswordRpt.value){

                tb_PasswordRpt.classList.add("error");
                alertSpan.innerText = "No spaces allowed here";
                
                formIsValid = false;

            }
            else{

                if(tb_PasswordRpt.classList.contains("error")){
                    tb_PasswordRpt.classList.remove("error");
                }

                alertSpan.innerText = "";

                formIsValid = true;

            }

        })


        /*****************Functions */
        function generateHash(userName, password){

            return new Promise((resolve, reject)=>{
    
                const hash = cryptoJS.AES.encrypt(password, userName).toString()
    
                resolve(hash)
    
            })
    
    
        }

        

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