"use strict";

import { lstat } from "fs";
import Millify from "millify";
import DATABASE from "../../model/DATABASE";
import Notifications from "../Alerts/NotificationController";
import { createEmployeeItem } from "../utilities/TableController";
const cryptoJS = require("crypto-js");
const commaNumber = require("comma-number");

const database = new DATABASE()
let validation;



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
                promptBox.querySelector('.img_close').addEventListener("click",()=>{
                    
                    const mainBodyContent = document.querySelector(".mainBody_content")

                    if(mainBodyContent.querySelector('.modal') !== null){

                        // mainBodyContent.querySelector('.modal').remove();
                        promptBox.remove()

                        document.querySelector('.contentCover').classList.remove('contentCover--shown')

                        reject()
                        
                    }

                })

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
            exitPromptBox.className = "exitPromptBox modal";
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
            let reorderLevel = "";

           

            if(row !==""){
    
                itemName = row.querySelector(".td_Names").innerText;
                brand  =  row.querySelector(".td_Brands").innerText;
                category = row.querySelector(".td_Category").innerText;
                itemQuantity = row.querySelector(".td_Stock").innerText;
                sellingPrice = row.querySelector(".td_sellingPrice").innerText;
                costPrice = row.querySelector(".td_costPrice").innerText
                discount = row.querySelector(".td_discount").innerText
                reorderLevel = row.querySelector(".td_reOrderLevel--hidden").innerText;
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

                            <label class="quarterwidth" id="lbl_discount">
                                <span>Discount (%)</span>
                                <input type="number" class="dialogForm_tb" value="${parseFloat(discount)}" aria-placeholder="Discount(%)"  id="discount" />
                            </label>

                            <label class="quarterwidth" id="lbl_reorderlevel">
                                <span>Reorder Level</span>
                                <input type="number" class="dialogForm_tb" value="${parseFloat(reorderLevel)}" aria-placeholder="Discount(%)"  id="reorderLevel" />
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

                            itemForm.querySelector("form").querySelector(".flexContainer").querySelector("#lbl_category").replaceChild(newTextBox, categorySelect)


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

                            console.log(newTextBox, brandSelect);

                            itemForm.querySelector("form").querySelector(".flexContainer").querySelector("#lbl_brand").replaceChild(newTextBox, brandSelect)


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

                    discount = itemForm.querySelector('#discount').value;

                    const reorderLevel = itemForm.querySelector("#reorderLevel").value;

                    // console.log(name, category, brand, stock, price);

                    if(name !== "" && category !== "" && brand !== "" && stock !== "" && sellingPrice !== ""){

                        

                        closeModal(itemForm);

                        // openPrompt("",resolve,reject, [true, row, name, brand, category, stock, sellingPrice])

                        resolve([true, row, name, brand, category, stock, sellingPrice, costPrice, discount, reorderLevel]);


                    }
                  
                }

                function exitBox(){
                    closeConfirmationBox(resolve, reject)
                }

            


        })

        

    }


/************************************************************************************************************************************************************************/ 

                   

    
    static openUserForm(newUser, userNamePara="", firstNamePara="", lastNamePara="", accountStatus=""){

        return new Promise((resolve, reject)=>{
            
        
            let formTitle, disabled, btnLabel;

            if(newUser === true){

                formTitle = "New Account"
                disabled = " ";
                btnLabel = "Employ";

            }
            else{
                formTitle = "Edit Account";
                disabled = "disabled";
                btnLabel = "Submit Change"
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
                <div class="notificationBanner"></div>

                <form>

                    <label class="formlbl lbl_FirstName" for="tb_FirstName">

                        First Name
                        <input class="userForm_input tb_firstName" value="${firstNamePara}" ${disabled} class="tb_FirstName" type="text" placeholder="eg. Adwoa">
                        <span class="alertSpan"></span>

                    </label>

                    <label class="formlbl lbl_LastName" for="tb_LastName">

                        Last Name
                        <input class="userForm_input tb_lastName" value="${lastNamePara}" ${disabled} type="text" placeholder="eg. Sarpong">
                        <span class="alertSpan"></span>

                    </label>

                    <label class="formlbl lbl_UserName" for="tb_UserName">

                        Username
                        <input class="userForm_input tb_UserName" value="${userNamePara}" ${disabled} type="text" placeholder="eg. adwoaSar11"/>
                        <span class="alertSpan"></span>

                    </label>

                    <label class="formlbl lbl_Password" for="tb_Password">

                        Password
                        <input class="userForm_input tb_Password"  id="tb_Password" class="form_Password" type="password" placeholder="eg. eightlengthedpassword"/>
                        <span class="alertSpan"></span>

                    </label>

                    <label class="formlbl lbl_Password" for="tb_PasswordRpt">

                        Confirm Password
                        <input class="userForm_input tb_PasswordRpt" id="tb_PasswordRpt" class="form_Password" type="password" placeholder="eg. repeatpassword"/>
                        <span class="alertSpan"></span>


                    </label>

                    <label class="formlbl lbl_Password" for="tb_PasswordRpt">

                        Account Type
                    <select value="${accountStatus}" class="userForm_input slct_accountType" ${disabled}>
                            <option value="0">Regular</option>
                            <option value="1">Administrator</option>
                    </select>
                    <span class="alertSpan"></span>

                    </label>


                </form>

                <button class="btn_employ">${btnLabel}</button>

            `

            contentContainer.appendChild(userForm);

            setTimeout(()=>{

                userForm.classList.add("userForm--shown")

            },400)

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
            const notificationBanner = userForm.querySelector(".notificationBanner");

            const firstNameAlert =  tb_FirstName.parentElement.querySelector(".alertSpan");
            const secondNameAlert = tb_LastName.parentElement.querySelector(".alertSpan");
            const passwordAlert = tb_Password.parentElement.querySelector(".alertSpan");
            const passwordRptAlert = tb_PasswordRpt.parentElement.querySelector(".alertSpan");
            const userNameAlert = tbUserName.parentElement.querySelector(".alertSpan");

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

                userForm.classList.remove("userForm--shown");
                contentCover.classList.remove("contentCover--shown");

                setTimeout(() => {

                    userForm.remove()
                    
                }, 400);

                reject();


            });

            btnEmploy.addEventListener("click", (e)=>{

                

                if((validateForm(tb_FirstName.value, tb_LastName.value, tbUserName.value, tb_Password.value, tb_PasswordRpt.value) )){

                    userForm.classList.remove("userForm--shown");
                    contentCover.classList.remove("contentCover--shown");

                    setTimeout(() => {

                        userForm.remove();
                        
                    }, 400);

                    generateHash(tbUserName.value, tb_PasswordRpt.value)
                    .then((hashedPassword)=>{

                        resolve({
                            First_Name: tb_FirstName.value,
                            Last_Name: tb_LastName.value,
                            User_Name: tbUserName.value,
                            Password: hashedPassword,
                            IsAdmin: slct_accountType.value
                        })

                    })

                }
                else{

                   userNameAlert.innerText = "Must be atleast 5 characters long";
                   tbUserName.classList.add("error");

                   firstNameAlert.innerText = "Must be atleast 3 characters long";
                   tb_FirstName.classList.add("error");

                   secondNameAlert.innerText = "Must be atleast 3 characters long";
                   tb_LastName.classList.add("error");

                   passwordAlert.innerText = "Must be atleast 5 characters long and alpha numeric";
                   tb_Password.classList.add("error");

                   passwordRptAlert.innerText = "Must match with first password";
                   tb_PasswordRpt.classList.add("error");


                }

                function validateForm(firstName, lastName, userName, firstPassword, secndPassword){

                    let threeChars = /(.*[a-z]){3}/i;
                    let fiveChars = /(.*[a-z]){5}/i;

                    if(threeChars.test(firstName) === true && threeChars.test(lastName) === true && fiveChars.test(userName)===true && fiveChars.test(firstPassword) && firstPassword === secndPassword){

                        return true

                    }
                    else{
                        return false;
                    }

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

        })

            
        

    }

    static openProfitsDialogLoading(){

        const contentCover = document.querySelector(".contentCover");
        const contentContainer = document.querySelector(".contentContainer");

        contentCover.classList.add(".contentCover--shown");

        if(contentContainer.querySelector(".profitDialog")){

            contentContainer.querySelector(".profitDialog").remove();

        }

        contentCover.classList.add("contentCover--shown");

        const profitDialog = document.createElement("div");
        profitDialog.className = "profitDialog modal";

        profitDialog.innerHTML = "<img src='../../utils/media/animations/loaders/Rolling-1s-200px-grey.svg'/>"

        contentContainer.appendChild(profitDialog);
        

        setTimeout((()=>{

            profitDialog.classList.add("profitDialog--shown");

        }),300)

    }

    static openProfitsDialog(totalSales, totalDiscount, totalRevenue, totalProfit){
        

        const contentCover = document.querySelector(".contentCover");
        const contentContainer = document.querySelector(".contentContainer");
        contentCover.classList.add("contentCover--shown");


        const profitDialog = contentContainer.querySelector(".profitDialog");
     
        profitDialog.innerHTML = 
        `
            <header>
                <span>More</span>
                <img src="../Icons/modals/close.svg" />
            </header>

            <center>

                <label id="sales" class="profitLabel">
                    Total Sales
                    <label class="value">${Millify(totalSales)}</label>
                    <label class="lbl_toolTip">${commaNumber(totalSales)}</label>
                </label>

                <label id="discount" class="profitLabel">
                    Total Discount
                    <label class="value">${Millify(totalDiscount)}</label>
                    <label class="lbl_toolTip">${commaNumber(totalDiscount)}</label>
                </label>

                <label id="revenue" class="profitLabel">
                    Total Revenue
                    <label class="value">GH¢ ${Millify(totalRevenue)}</label>
                    <label class="lbl_toolTip">GH¢ ${commaNumber(totalRevenue)}</label>
                </label>

                <label id="profit" class="profitLabel">
                    Total Profit
                    <label class="value">GH¢ ${Millify(totalProfit)}</label>
                    <label class="lbl_toolTip">GH¢ ${commaNumber(totalProfit)}</label>
                </label>

            </center>

        `

        contentContainer.appendChild(profitDialog);


        setTimeout((()=>{

            profitDialog.classList.add("profitDialog--shown");

        }),300)

        /*************Event Listeners */
        const btnClose = profitDialog.querySelector("img");
        btnClose.addEventListener("click", (e)=>{

            profitDialog.classList.remove("profitDialog--shown")

            setTimeout(() => {

                profitDialog.remove();
                contentCover.classList.remove("contentCover--shown")
                
            }, 250);

        })

        /***Hover acctions */
        const sales = profitDialog.querySelector("#sales");
        let timeoutId_sales;

        sales.addEventListener("mouseenter", ()=>{
                
            timeoutId_sales = setTimeout(function showToolTip(){
    
                sales.querySelector(".lbl_toolTip").style.display = "block";
    
            }, 1500)
    
        });
    
        sales.addEventListener("mouseleave", ()=>{
    
            clearTimeout(timeoutId_sales);

            sales.querySelector(".lbl_toolTip").style.display = "none";
    
        })

        /*__________________________________________________________________________*/

        const discount = profitDialog.querySelector("#discount");
        let timeoutId_discount;

        discount.addEventListener("mouseenter", ()=>{
                
            timeoutId_discount = setTimeout(function showToolTip(){
    
                discount.querySelector(".lbl_toolTip").style.display = "block";
    
            }, 1500)
    
        });
    
        discount.addEventListener("mouseleave", ()=>{
    
            clearTimeout(timeoutId_discount);

            discount.querySelector(".lbl_toolTip").style.display = "none";
    
        })

        /*_______________________________________________________________________________________________*/
        const revenue = profitDialog.querySelector("#revenue");
        let timeoutId_revenue;

        revenue.addEventListener("mouseenter", ()=>{
                
            timeoutId_revenue = setTimeout(function showToolTip(){
    
                revenue.querySelector(".lbl_toolTip").style.display = "block";
    
            }, 1500)
    
        });
    
        revenue.addEventListener("mouseleave", ()=>{
    
            clearTimeout(timeoutId_revenue);

            revenue.querySelector(".lbl_toolTip").style.display = "none";
    
        })


        /*____________________________________________________________________________________________________________*/
        const profit = profitDialog.querySelector("#profit");
        let timeoutId_profit;

        profit.addEventListener("mouseenter", ()=>{
                
            timeoutId_profit = setTimeout(function showToolTip(){
    
                profit.querySelector(".lbl_toolTip").style.display = "block";
    
            }, 1500)
    
        });
    
        profit.addEventListener("mouseleave", ()=>{
    
            clearTimeout(timeoutId_profit);

            profit.querySelector(".lbl_toolTip").style.display = "none";
    
        })

    }

    static openProfitsDialogError(){

        const contentContainer = document.querySelector(".contentContainer");

        
        const profitDialog =contentContainer.querySelector(".profitDialog");


        profitDialog.innerHTML = 
        `
            "Sorry. An errorr occurred."
        `

    }

    static makeDraggable(){



    }
}











/*****************************************************************************FUNCTIONS***************************************************************/


///Event Listener Functions
function closeConfirmationBox(resolve, reject, edited="", name=""){

    const mainBodyContent = document.querySelector(".mainBody_content")

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

    const mainBodyContent = document.querySelector(".mainBody_content")

    if(mainBodyContent.querySelector('.modal') !== null){

        // mainBodyContent.querySelector('.modal').remove();
        closeModal(modal);

        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        resolve()
        
    }
}

// Validates password provided in prompt box and removes removes specified element
function confirmRemove(itemName, resolve, reject, justVerify=""){

        const mainBodyContent = document.querySelector(".mainBody_content");

        const modal =  mainBodyContent.querySelector('.modal');


        closeModal(modal);
        resolve (["edited", justVerify])

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