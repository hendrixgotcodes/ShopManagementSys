"use strict";

const clip = require('text-clipper').default;
const { default: Millify } = require('millify');
const millify = require('millify');
const database = require('../../model/DATABASE');
const ToolTipsController = require('../utilities/ToolTipsController')
// import ToolTipsConTroller from '../utilities/UnitConverter';

class TableController{

    static createItem(name, brand, category, stock, sellingPrice, discount,functions, hasItems,costPrice="", purchased="", dontHighlightAfterCreate = false, isdeletedItem=false, destinationPage="", Scroll=true){



            return new Promise((resolve, reject)=>{                

                
                const tableROWS = document.querySelectorAll('tr');

                tableROWS.forEach((row)=>{

                    if(row.Name === name && row.Category === category && row.Brand === brand){

                        reject("already created")

                    }

                })


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
                <td class="td_Names">${clip(name, 23)}</td>
                <td class="td_Brands">${clip(brand, 23)}</td>
                <td class="td_Category">${clip(category, 23)}</td>
                <td class="td_Stock">${stock}</td>
                <td class="td_Price">${parseFloat(sellingPrice)}</td>
                <td hidden class="td_costPrice">${parseFloat(costPrice)}</td>
                <td hidden class="td_discount">${parseFloat(discount)}</td>
                <td hidden class="state">visible</td>
                `;

                row.innerHTML = rowContent;
                row.id = tableROWS.length + 1;
                row.className = "bodyRow";                

                if(hasItems === true){

                    tableROWS.forEach((tableRow)=>{

            
                        if(tableRow.querySelector('.td_Names').innerText === row.querySelector('.td_Names').innerText){
                            document.querySelector('.tableBody').replaceChild(row, tableRow);

                            returnedValue = 1;

                        }
                        else{
                            document.querySelector(".tableBody").appendChild(row);

                            ToolTipsController.generateToolTip('row.id', name);

                            console.log('not matched');

                        }
                    })

                }
                else if(hasItems !== true) {

                    document.querySelector(".tableBody").appendChild(row);
                    returnedValue = true;
                }

                


                if(Scroll === true){
                    row.scrollIntoView(
                        {behavior: 'smooth'}
                    )
                }
                

                
                
                
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

                    // row.addEventListener("blur", ()=>{

                    //     if(row.classList.contains("controlShown")){
                    //         row.style.transform = "translateX(0px)"
                    //         row.classList.remove("controlShown");
                    //     }

                    //     console.log(row.classList);

                    // })

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


    static editItem(row, name, brand, category, stock, sellingPrice, costPrice,discount){

      

        if(row === ""){

            console.log(null);

            let tableRows = document.querySelector("tbody").querySelectorAll("tr");

            tableRows.forEach((currentRow)=>{

                if(currentRow.querySelector('.td_Names').innerText === name && currentRow.querySelector('.td_Brands').innerText === brand && currentRow.querySelector('.td_Category').innerText === category){

                    currentRow.querySelector('.td_Names').innerText = name;
                    currentRow.querySelector('.td_Brands').innerText = brand;
                    currentRow.querySelector('.td_Category').innerText = category;
                    currentRow.querySelector('.td_Stock').innerText = stock;
                    currentRow.querySelector('.td_Price').innerText = sellingPrice;
                    currentRow.querySelector('.td_discount').innerText = discount;
                    currentRow.querySelector(".td_costPrice").innerText = costPrice
                }

            })

            return

        }

        row.querySelector('.td_Names').innerText = name;
        row.querySelector('.td_Brands').innerText = brand;
        row.querySelector('.td_Category').innerText = category;
        row.querySelector('.td_Stock').innerText = stock;
        row.querySelector('.td_Price').innerText = sellingPrice;
        row.querySelector('.td_discount').innerText = discount;
        row.querySelector(".td_costPrice").innerText = costPrice


        return true;
    }

    // static editMany(Array){

    //     const inTable = [];

    //     const table = document.querySelectorAll("tr");

    //     Array.forEach((item)=>{

    //         table.forEach((row)=>{

    //             if(row.querySelector('.td_Names').innerText === item.Name && row.querySelector('.td_Brands').innerText === item.Brand){

    //                 this.editItem(row, item.Name, item.Brand, item.Category, item.InStock, item.SellingPrice, item.Discount)


    //             }

    //         })

    //     })

    // }



    
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



        // const tBody = document.querySelector('tbody');

        const template = 
        `
                <center>

                    <img src="../../utils/media/animations/loaders/Spin-1s-200px.svg" alt=${loadinInfo} />
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

   static showErrorBanner(loadinInfo){

        const template = 
        `
                <center>

                    <img src="../../utils/media/animations/loaders/error.svg" alt=${loadinInfo} />
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


   static uncheckRows(name, brand, category){

        const tRows = document.querySelector('tbody').querySelectorAll('tr');

        console.log(name, brand);

        tRows.forEach((row)=>{

            let rowName = row.querySelector('.td_Names').innerText;
            let rowBrand = row.querySelector('.td_Brands').innerText
            let rowCategory = row.querySelector('.td_Category').innerText
            let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')

            if(rowName === name && rowBrand === brand && rowCategory === category){
                    checkbox.checked = false;
                    console.log('checked');
            }
            else{
                console.log('not cheked');
            }

        })


   }

   static addToCart(row){

        /******************PROGRAM VARIABLES*******************/
            let inCart = [];

        /*****************DOM ELEMENTS**************************/
        const tableRows = document.querySelector("tbody").querySelectorAll("tr");

        const cart = document.querySelector(".cart");
        const subTotal = cart.querySelector(".subTotal").querySelector(".value")
        const mainTotal = cart.querySelector(".mainTotal").querySelector(".value")
        const cartItemElements = document.querySelector(".cart").querySelector(".cartItems");
        const btnCart_clear = cart.querySelector(".btnCart_clear")
        const btnCart_sell = cart.querySelector(".btnCart_sell")


        let [itemName, itemBrand,itemCategory, discount, itemPrice, itemStock, itemCostPrice] = [row.querySelector(".td_Names").innerText, row.querySelector(".td_Brands").innerText, row.querySelector(".td_Category").innerText,row.querySelector('.td_discount').innerText, row.querySelector(".td_Price").innerText, row.querySelector('.td_Stock').innerText,  row.querySelector('.td_costPrice').innerText]
        itemPrice = parseFloat(itemPrice)
        let itemExists = false;
    
      


        if(cartItemElements.querySelector(".cartInfo") !== null){

            cartItemElements.querySelector(".cartInfo").style.display = "none"
            document.querySelector(".cart").querySelector(".btnCart_clear").disabled = false;
            document.querySelector(".cart").querySelector(".btnCart_sell").disabled = false

        }
        
        //Select all item elements in the cart element
        const itemsInCart = cartItemElements.querySelectorAll(".cartItem");

        //Iterate through if already exists, remove
        itemsInCart.forEach((item)=>{

            if(item.querySelector(".hidden_itemName").innerText === itemName && item.querySelector(".hidden_itemBrand").innerText === itemBrand && item.querySelector(".hidden_itemCategory").innerText === itemCategory ){

                item.classList.remove("cartItem--shown")

                setTimeout(()=>{
                    item.remove()
                }, 300)

                subtractItem(item)

            }

        })

        if(itemExists === true){
            return
        }


        const cartItemTemplate = 
        `
            <div class="cartItem_details">
                <div class="cartItem_Name">${clip(itemName, 10)}</div>
                <div class="cartItem_Brand">${clip(itemBrand, 10)}</div>
                <div hidden class="hidden_itemCategory">${itemCategory}</div>
                <div hidden class="hidden_itemName">${itemName}</div>
                <div hidden class="hidden_itemBrand">${itemBrand}</div>
            </div>

            <button class="cartItem_discount cartItem_discount--disabled">

                <div class="discountValue">-${discount}%</div>

            </button>

            <input type="checkbox" class="cb_cartItem" />



        `

        const cartItem = document.createElement("div");
        cartItem.className = "cartItem";

        cartItem.innerHTML = cartItemTemplate;
        
        cartItemElements.appendChild(cartItem)


        setTimeout(()=>{

            cartItem.classList.add("cartItem--shown")
            cartItem.scroll({
                behavior: "smooth",
            })


        }, 100)

        let itemCount = parseInt(itemStock);
        
        const itemSelect = document.createElement("select");
        itemSelect.className = "cartItem_count";

        for(let i = 1; i <= itemCount; i++){

            let option = document.createElement("option")
            option.value = i;
            option.innerText = i;

            itemSelect.appendChild(option)


        }

        cartItem.appendChild(itemSelect)


        const cartItemCost = document.createElement("div");
        cartItemCost.className = "cartItem_cost";
        cartItemCost.innerText = `GH¢ ${Millify(itemPrice,
             {
                units: ['', 'K', 'M', 'B', 'T', 'P', 'E'],
                precision: 2
             })}`;
        cartItem.appendChild(cartItemCost)

        let currentSubtotal = parseFloat(subTotal.innerText)

        subTotal.innerText = currentSubtotal + itemPrice;
        mainTotal.innerText = subTotal.innerText;

        
        // EVENT LISTENERS
        itemSelect.addEventListener("change", function modifyCost(e){

            let itemQuanity = parseInt(itemSelect.value);
            let totalItemCost = parseFloat(itemQuanity * itemPrice).toPrecision(3);
            cartItemCost.innerText = `GH¢${totalItemCost}`;

            let currentSubtotal = parseFloat(subTotal.innerText)
            console.log(currentSubtotal);
            subTotal.innerText = currentSubtotal + parseFloat(totalItemCost);

            mainTotal.innerText = subTotal.innerText

        })


        /************************************************************************************ */

        let checkbox = cartItemElements.querySelector(".cb_cartItem");
        checkbox.addEventListener("click", function toggleDiscount(){

            console.log("in check");

            if(checkbox.checked === true){

                cartItemElements.querySelector(".cartItem_discount").classList.remove("cartItem_discount--disabled")

            }
            else{
                cartItemElements.querySelector(".cartItem_discount").classList.add("cartItem_discount--disabled")
            }

        })
        /******************************************************************************************** */

        btnCart_clear.addEventListener("click", clearAllItems)



       //Add new Item(object) to array of selected items(objects)

       let totalItemRevenue = parseFloat(parseInt(itemSelect.value) * parseInt(itemPrice))
       let totalItemCostPrice = parseFloat(parseInt(itemSelect.value) * parseInt(itemCostPrice))

       inCart.push({
        Item: {
            Name: itemName,
            Brand: itemBrand,
            Category: itemCategory
        },
        Purchased: parseInt(itemStock),
        Revenue: totalItemRevenue,
        Profit: totalItemRevenue - totalItemCostPrice,
        UnitDiscount: discount,
        TotalDiscount: parseFloat(discount) * parseInt(itemSelect.value)
    })

    
    /****************************FUNCTIONS***********************/
    function subtractItem(item){

        let itemQuanity = parseFloat(item.querySelector(".cartItem_count").value)
        let itemTotalCost = itemQuanity * itemPrice

        let initSubTotal = parseFloat(subTotal.innerText)

        if(initSubTotal > 0){

            subTotal.innerText = parseFloat(subTotal.innerText) - itemTotalCost;
            mainTotal.innerText = subTotal.innerText
    
            itemExists = true;
    
            //Filter and reassign the inCart array the items whose name, brand and category does not equal the current item
            inCart = inCart.filter(function(cartItem){
    
                return cartItem.Item.Name;
    
            })
    

        }

    }

    function clearAllItems(){

        const itemsInCart = cartItemElements.querySelectorAll(".cartItem");
        const allAnimationsDone = []

        //disbling cart buttons
        btnCart_clear.disabled = true;
        btnCart_sell.disabled = true;

        for(let i = itemsInCart.length-1; i >=0; i--){

            allAnimationsDone.push(new Promise((resolve, reject)=>{

                const afterAnimation = new Promise((resolve, reject)=>{

                    const itemName = itemsInCart[i].querySelector(".hidden_itemName").innerText;
                    const itemBrand = itemsInCart[i].querySelector(".hidden_itemBrand").innerText;
                    const itemCategory = itemsInCart[i].querySelector(".hidden_itemCategory").innerText;


                    setTimeout(()=>{

                        tableRows.forEach((row)=>{

                            let rowName = row.querySelector('.td_Names').innerText;
                            let rowBrand = row.querySelector('.td_Brands').innerText
                            let rowCategory = row.querySelector('.td_Category').innerText
                            let checkbox = row.querySelector('.td_cb').querySelector('.selectOne')

                            if(rowName === itemName && rowBrand === itemBrand && rowCategory === itemCategory){
                                    checkbox.checked = false;
                            }

                        })
                        
    
                        itemsInCart[i].classList.remove("cartItem--shown");
    
                        resolve()
        
                    }, (i*350))
    
                })
    
                afterAnimation.then(()=>{

                    subtractItem(itemsInCart[i])
    
                    setTimeout(()=>{
    
                        itemsInCart[i].remove()

                        resolve()
        
                    }, (i*500))
    
    
                })

            }))

        }

        Promise.all(allAnimationsDone)
        .then(()=>{

            cart.querySelector(".cartInfo").style.display = "block"

        })


    }

    // functon sellItems(){

    //     database.sel

    // }


   }
}


module.exports = TableController;
