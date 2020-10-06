const items_in_Categories = ["Books","Tisues"];
const items_in_Brands = ["Ghana Schools", "N/A"];

const tip_default = document.querySelector('.tip_default');
const selectValue_span = document.querySelector('.selectValue_span');

tip_default.addEventListener('click',()=>{
    selectValue_span.innerHTML = "Filter By:"
    selectValue_span.setAttribute("value", "default");
})




/*************************************FUNCTIONS********************* */
function wrapText(text){

    if(text.length > 5){
        text = text.slice(0,5) + '...';
    }

    return text;
   
}