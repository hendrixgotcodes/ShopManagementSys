// const { ipcRenderer } = require('electron');
const xlsx = require('xlsx');
// const TableController = require('./TableController');


/*********DOM ELEMENTS*********/
const listItemExcel = document.querySelector(".dd_listItem--excel");
const checkBtn = document.querySelector(".checkBtn");
const btnDropDown = document.querySelector(".btn_dropDown");





listItemExcel.addEventListener("click", openFileExplorer)


function openFileExplorer(){

    if(checkBtn.checked === true){
        btnDropDown.hidden = true;
        checkBtn.checked === false;
    }

    //Will cause ipcMain to trigger serveFilePath event
    ipcRenderer.send("openFileExplorer")

}
// Listens to serveFilePath event
ipcRenderer.on("serveFilePath",(e, path)=>{
    renderXLFile(path);
})




/*******************FUNCTIONS */
function renderXLFile(path){
    const excelFile =  xlsx.readFile(path[0]);

    let firstPage = excelFile.Sheets['Inventory'];

    let firstPageJSON = xlsx.utils.sheet_to_json(firstPage)

    //Opens Modal and displays items in open 
    parseExcelOutput("From Excel",firstPageJSON)


}





/************************************************FUNCTIONS*********************************************/
function parseExcelOutput(formTitle, JSON){

    const formTemplate = 
    `
        <div class="dialogContainer fullwidth aDialog" role="container">
            <div class="dialogHeader" role="header">

                ${formTitle}    

                <img class="img_close" src="../Icons/Modals/close.svg" alt="Close Modal" />

            </div>

            <div class="table">
            

                    <div class="tableHeader">

                        <div class="long">
                            Name
                        </div>

                        <div class="long">
                            Brand
                        </div>

                        <div class="long">
                            Category
                        </div>

                        <div class="long">
                            Reorder Level
                        </div>

                        <div class="Short">
                            In Stock
                        </div>

                        <div class="Short">
                            C.P
                        </div>

                        <div class="Short">
                            S.P
                        </div>

                        <div class="Short">
                            Discount
                        </div>

                        <div class="long">
                            Barcode
                        </div>
                    
                    </div>

                    <div class="tableBody">

                    </div>

            
            </div>

            <div class="dialogFooter fullwidth" role="footer" aria-placeholder="Confirm here">
                <div class="dialogConfirm">
                    Save
                    <img src="../Icons/Modals/add.svg" alt="Confirmation Message" />
                </div>
            </div>

        </div>
            
    `

    const itemForm = document.createElement('div');
            itemForm.className = "modal dialog--itemFormBox dialog--excelForm";
            itemForm.classList.add("dialog--promptBox")
            itemForm.setAttribute("aria-placeholder", "Confirm Box");
    
            itemForm.innerHTML = formTemplate;
    
            const mainBodyContent = document.querySelector('.mainBody_content');

            mainBodyContent.appendChild(itemForm);

    
            document.querySelector('.contentCover').classList.add('contentCover--shown')

            setTimeout(()=>{
                    mainBodyContent.querySelector(".dialog--itemFormBox").classList.add("dialog--shown")
            }, 100)


            //Adding Items to List

            let tableBody = itemForm.querySelector('.table').querySelector('.tableBody');

            JSON.forEach((item)=>{

                if(isNaN(parseInt(item.QUANTITY)) || isNaN(parseInt(item.COSTPRICE)) || isNaN(parseInt(item.SELLINGPRICE)) || isNaN(item.REORDER_LEVEL)){

                    showAlert('error', "Your excel sheet is invalid! Please check, correct all fields and try again")

                    closeConfirmationBox();
                }
                else if(isValidForm(item) === false){

                    showAlert('error', "Your excel sheet is invalid! Please check, correct all fields and try again")

                    closeConfirmationBox();


                }


                let itemTemplate = 
                `
                    <div class="rowContainer">


                        <div class="long td" id="names">
                            ${item.NAMES}
                        </div>

                        <div class="long td" id="names">
                            ${item.BRAND}
                        </div>

                        <div class="long td" id="names">
                            ${item.CATEGORY}
                        </div>

                        <div class="long td" id="names">
                            ${item.REORDER_LEVEL}
                        </div>

                        <div class="Short td" id="quantity">
                            ${item.QUANTITY}
                        </div>

                        <div class="Short td" id="cp">
                            ${item.COSTPRICE}
                        </div>

                        <div class="Short td" id="sp">
                            ${item.SELLINGPRICE}
                        </div>

                        <div class="Short td" id="discount">
                            ${item.DISCOUNT}
                        </div>

                        <div class="long td" id="names">
                            ${item.BARCODE}
                        </div>


                    </div>
                `
                let newRow = document.createElement('div');
                newRow.className = "tableRow";
                newRow.innerHTML = itemTemplate;

                tableBody.appendChild(newRow);

            })
            

            
            //Event Listeners
            itemForm.querySelector('.img_close').addEventListener("click",exitBox);

            itemForm.querySelector('.dialogConfirm').addEventListener("click", saveFormData);

            function saveFormData(){

               ipcRenderer.send('populateTable', JSON)

               exitBox()

            }

            function exitBox(){
                closeConfirmationBox()
            }
        



}

/************************************************CALLED TO CLOSE EXCEL MODAL*********************************************/
function closeConfirmationBox(){
    if(mainBodyContent.querySelector('.modal') !== null){

       // document.querySelector(".dialog--confirmationBox").querySelector('.img_close').removeEventListener("click",closeConfirmationBox)
       // document.querySelector(".dialog--confirmationBox").querySelector(".dialogRevert").removeEventListener("click",closeConfirmationBox)
        mainBodyContent.querySelector('.modal').remove();

        
        document.querySelector('.contentCover').classList.remove('contentCover--shown')

        
    }
        
}



/************************************************CALLED TO SHOW NOTIFICATION*********************************************/
function showAlert(errorType, message){

    const mainBodyContent = document.querySelector(".mainBody_content");

    errorType = errorType.toLowerCase();

    let bGColor;

    switch (errorType){
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

        }, 7000)   


   })

    


}

function isValidForm(item){

    if(item.NAMES === null || item.BRAND === null || item.CATEGORY === null || item.QUANTITY === null || item.COSTPRICE === null || item.SELLINGPRICE ===null || item.DISCOUNT === null || item.REORDER_LEVEL === null){

        return false

    }
    else if(item.NAMES === undefined || item.BRAND === undefined || item.CATEGORY === undefined || item.QUANTITY === undefined || item.COSTPRICE === undefined || item.SELLINGPRICE === undefined || item.DISCOUNT === undefined || item.REORDER_LEVEL === undefined || item.BARCODE === undefined){

        return false

    }
    else if((typeof item.QUANTITY) !== "number" || (typeof item.COSTPRICE) !== "number" || (typeof item.SELLINGPRICE) !== "number" || (typeof item.DISCOUNT) !== "number" || (typeof item.REORDER_LEVEL) !== "number"){

        return false

    }
    else if(item.NAMES.replace(/^\s+|\s+$/g, "") === "" || item.BRAND.replace(/^\s+|\s+$/g, "") === "" || item.CATEGORY.replace(/^\s+|\s+$/g, "") === "" ){
        return false

    }
    else{
        true
    }
}