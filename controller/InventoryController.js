/************IMPORT******/
import Modal from '../controller/modals/ModalController';

/************DOM ELEMENTS */
const toolBar_btn = document.querySelector('.toolBar_btn--alpha');
const toolBar_btn_icon = document.querySelector('.ico_btn_add')

const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');





/************EVENT LISTENERS */
toolBar_btn.addEventListener('mouseover',toggleTBbtn_white)
toolBar_btn.addEventListener('mouseleave',toggleTBbtn_default)

//Right Click event lister for each row
tableROWS.forEach((row)=>{
    row.addEventListener("contextmenu",(e)=>{

      
            showRowControls(row)
    })
})


//Buttons in "Control" box of every row
tableROWS.forEach((row)=>{
    row.querySelector(".controls").querySelector(".del").addEventListener("click",()=>{
        deleteRow(row);
    });
})



/************FUNCTIONS */
function toggleTBbtn_white(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd.svg')
}

function toggleTBbtn_default(){
    toolBar_btn_icon.setAttribute('src', '../Icons/toolBar/btnAdd--green.svg')
}


function showRowControls(row){
    if(row.classList.contains("controlShown")){
        row.style.transform = "translateX(0px)"
        row.classList.remove("controlShown");
    }
    else{
        // row.style.transition = ".7s"
        // row.style.transform = "translateX(150%)"
        row.style.transform = "translateX(15%)"
        row.classList.add("controlShown");

        // setTimeout(()=>{
        //     row.remove()
        // }, 500)

    }   

}


function deleteRow(row){
    Modal.openConfirmationBox(row.querySelector(".td_Names").innerText, row.querySelector(".td_Stock").innerText)
}
