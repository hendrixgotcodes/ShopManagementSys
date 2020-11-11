"use strict";

class TableController{

    static createItem(name, brand, category, stock, sellingPrice, functions, hasItems,costPrice="", purchased="", dontHighlightAfterCreate = false, isdeletedItem=false, destinationPage=""){


            return new Promise((resolve, reject)=>{


                
                const tableROWS = document.querySelector('tbody').querySelectorAll('tr');


                //Removing Empty Banner Before Addition of new row
                const emptyBanner = document.querySelector('.contentContainer').querySelector('.emptyBanner');

                let returnedValue = true;

                //Check if Default Banner is attached to the contentContainer
                if(emptyBanner !== null){
                    emptyBanner.remove();
                }



                // creating new row element
                const row =  document.createElement("tr");
                
                const rowContent = 
                `
                <td class="controls">
                    <div class="edit"><span>Edit</span></div>
                    <div class="del"><span>Soft Delete</span></div>
                </td>
                <td class="td_cb">
                    <input disabled type="checkbox" class="selectOne" aria-placeholder="select one">
                </td>
                <td class="td_Names">${name}</td>
                <td class="td_Brands">${brand}</td>
                <td class="td_Category">${category}</td>
                <td class="td_Stock">${stock}</td>
                <td class="td_Price">${sellingPrice}</td>
                <td hidden class="td_costPrice">${costPrice}</td>
                <td hidden class="state">visible</td>
                `;

                row.innerHTML = rowContent;
                row.className = "bodyRow";

                if(hasItems === true){

                    tableROWS.forEach((tableRow)=>{

            
                        if(tableRow.querySelector('.td_Names').innerText === row.querySelector('.td_Names').innerText){
                            document.querySelector('.tableBody').replaceChild(row, tableRow);

                            returnedValue = 1;

                        }
                        else{
                            document.querySelector(".tableBody").appendChild(row);

                            console.log('not matched');

                        }
                    })

                }
                else if(hasItems !== true) {

                    document.querySelector(".tableBody").appendChild(row);
                    returnedValue = true;
                }

                



                row.scrollIntoView(
                    {behavior: 'smooth'}
                )

                
                
                
                /********************************CONDTIONS***************************************/
/**_____________________________________________________________________________________________________________________________________________ */

                /**
                     * Destination Page determines which page is requesting for a table row to be created
                    */
                if(destinationPage.toLocaleLowerCase() === "inventory"){


                    //Destructing functions
                    let checkCB= functions[0];
                    let editItem = functions[1];
                    let deleteItem = functions[2];
                    let showRowControls = functions[3];

                    row.addEventListener("click", toggleCB);

                    row.querySelector(".controls").querySelector(".edit").addEventListener("click",
                    function editRow(e){
                        
                        //Prevents selection of row
                        e.stopPropagation();
                
                        editItem(row);
                    });
    
                    row.querySelector(".controls").querySelector(".del").addEventListener("click",
                        function deleteRow(e){
                        
                            //Prevents selection of row
                            e.stopPropagation();
                    
                            const rowState = row.querySelector(".state").innerText;

                            if(rowState === "visible"){
                    
                                deleteItem(row);
                    
                            }
                            else if(rowState === "deleted"){
                    
                                deleteItem(row, "recover");
                                
                            }
                        }
                    );
    
                    row.addEventListener("contextmenu",toggleRowControls);    

                    /**************FUNCTIONS**********************************/

                    function toggleCB(){
                        checkCB(row)
                    }

                    function toggleRowControls(){

                            showRowControls(row)

                    }

                        // if item is marked as deleted
                    if(isdeletedItem === true){
                    
                        row.style.opacity = ".55"

                        row.querySelector('.state').innerText = "deleted"

                    }
                    else{
                        row.querySelector('.state').innerText = "visible"
                    }


                }
                else if(destinationPage.toLocaleLowerCase() === "store"){
                    
                    if(isdeletedItem===true){
                        row.remove();
                    }

                    let rowCount = document.querySelector("tbody").querySelectorAll("tr").length;

                    if(rowCount === 0){

                        this.showIsEmpty();

                    }

                }

                /**_____________________________________________________________________________________________________________________________________________ */
            

            if(dontHighlightAfterCreate === true){


                resolve();
                return

            }

                    
            const initBGcolor = row.style.backgroundColor;
            const initColor = row.style.color;

            row.style.backgroundColor = 'rgba(53, 89, 75, 0.711)'
            row.style.color = "#fff"


            setTimeout(()=>{
                row.style.backgroundColor = initBGcolor;
                row.style.color = initColor;
            },3000)

            resolve()

                

                /******************************************* */


            })

    }

    
    
/***********************************************************************************************************************************/
    /******REMOVING ITEM FROM INVENTORY*****/
    static markAsRemove (itemName, itemBrand){


        itemName = itemName.toLowerCase();
        itemBrand = itemBrand.toLowerCase();


        const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

        tableROWS.forEach((row)=>{
              const name =   row.querySelector(".td_Names").innerText.toLowerCase();
              const brand = row.querySelector(".td_Brands").innerText.toLowerCase();

              if(row !== null && name === itemName && brand === itemBrand){

                row.style.opacity = '0.55';

                  //Set item state to deleted
                  row.querySelector(".state").innerText = "deleted"

              }
        })
            
    }


    static markAsVisible(itemName, itemBrand){

        itemName = itemName.toLowerCase();
        itemBrand = itemBrand.toLowerCase();


        const tableROWS = document.querySelector('.tableBody').querySelectorAll('.bodyRow');

        tableROWS.forEach((row)=>{
              const name =   row.querySelector(".td_Names").innerText.toLowerCase();
              const brand = row.querySelector(".td_Brands").innerText.toLowerCase();

              if(row !== null && name === itemName && brand === itemBrand){

                row.style.opacity = '1';

                //Set item state to deleted
                row.querySelector(".state").innerText = "recovered"

              }
        })

    }


    static editItem(row, name, brand, category, stock, price){
        row.querySelector('.td_Names').innerText =  name;
        row.querySelector('.td_Brands').innerText = brand;
        row.querySelector('.td_Category').innerText = category;
        row.querySelector('.td_Stock').innerText = stock;
        row.querySelector('.td_Price').innerText = price;

        return true;
    }



    
/***********************************************************************************************************************************/
   static showIsEmpty(){

        const tBody = document.querySelector('tbody');

        if(tBody.rows.length !== 0){
            return
        }

       const contentContainer = document.querySelector(".contentContainer");

       const template = 
       `
            <center>

                <img src="../img/empty.svg" />
                <span id="info">
                    Inventory Is Empty!
                </span>

            </center>
            
        
       `
       let emptyBanner = document.createElement('div');
       emptyBanner.className = "emptyBanner";
       emptyBanner.innerHTML = template;

       contentContainer.appendChild(emptyBanner);
   }



/***********************************************************************************************************************************/
//    FilterS Items Table Based On Their Category Or Brand      FilterBy = either category or brand, Key =  the Classification type
   static filterItems(filterBy, Key){

        const doneLoading = new Promise((resolve, reject)=>{

            filterBy = filterBy.toLowerCase();
            Key = Key.toLowerCase();

            switch (filterBy){
                case 'category':
                    filterBy = '.td_Category';
                    break;
                
                case 'brand':
                    filterBy = '.td_Brands';
                    break;
                
                default:
                    break;
            }

            const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');


            tableRows.forEach((tableRow)=>{


                    if(tableRow.querySelector(filterBy).innerText.toLowerCase() !== Key){

                        tableRow.style.display = 'none';

                        if(tableRow.classList.contains('sorted')){
                            tableRow.classList.remove('sorted');
                        }
                        
                    }
                    else{
                        tableRow.style.display = 'flex';
                        tableRow.classList.add('sorted');
                    }

            })

            resolve();

        })

        doneLoading.then(()=>{
            this.removeOldBanners();
        })

        this.showLoadingBanner("Loading Please Wait");


   }



   

   static resetTable(){

        const doneLoading = new Promise((resolve, reject)=>{

            const tableRows = document.querySelector('table').querySelector('tbody').querySelectorAll('tr');


            tableRows.forEach((tableRow)=>{


                    tableRow.style.display = 'flex';

            })

            resolve();

        })

        doneLoading.then(()=>{
            this.removeOldBanners();
        })

        this.showLoadingBanner("Loading Please Wait");


   }





/***********************************************************************************************************************************/



   static showLoadingBanner(loadinInfo){

       this.removeOldBanners();



        const tBody = document.querySelector('tbody');

        const template = 
        `
                <center>

                    <img src="../../utils/media/animations/loaders/Spin-1s-200px.svg" alt="Loading.." />
                    <span id="info">
                        ${loadinInfo}
                    </span>

                </center>
                
            
        `
        let emptyBanner = document.createElement('div');
        emptyBanner.className = "emptyBanner";
        emptyBanner.innerHTML = template;

        const contentContainer = document.querySelector(".contentContainer");

        contentContainer.appendChild(emptyBanner);

   }

   static removeOldBanners(){

        const contentContainer = document.querySelector(".contentContainer");
        const oldBanner = contentContainer.querySelector('.emptyBanner')

        if(oldBanner !== null){
            oldBanner.remove();
        }

   }


   static uncheckRows(name, brand){

        const tRows = document.querySelector('tbody').querySelectorAll('tr');

        console.log(name, brand);

        tRows.forEach((row)=>{

            let rowName = row.querySelector('.td_Names').innerText;
            let rowBrand = row.querySelector('.td_Brands').innerText
            let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')

            if(rowName === name && rowBrand === brand ){
                    checkbox.checked = false;
                    console.log('checked');
            }
            else{
                console.log('not cheked');
            }

        })


   }
}


module.exports = TableController;
