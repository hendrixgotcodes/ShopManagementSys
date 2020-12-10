"use strict";

const clip = require('text-clipper').default;
const { default: Millify } = require('millify');
const millify = require('millify');
const DATABASE = require('../../model/DATABASE');
const ToolTipsController = require('../utilities/ToolTipsController')
// import ToolTipsConTroller from '../utilities/UnitConverter';

const database = new DATABASE();

class DOMCONTROLLER{

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
                
                let rowContent = "";

                if(destinationPage.toLowerCase() === "store"){

                    rowContent = 
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
                    <td hidden class="td_Name--hidden">${name}</td>
                    <td hidden class="td_Brand--hidden">${brand}</td>
                    <td hidden class="td_Category--hidden">${category}</td>
                    <td hidden class="state">visible</td>
                    `;

                }
                else{

                    rowContent = 
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
                    <td class="td_costPrice">${parseFloat(costPrice)}</td>
                    <td class="td_sellingPrice">${parseFloat(sellingPrice)}</td>
                    <td hidden class="td_discount">${parseFloat(discount)}</td>
                    <td hidden class="td_Name--hidden">${name}</td>
                    <td hidden class="td_Brand--hidden">${brand}</td>
                    <td hidden class="td_Category--hidden">${category}</td>
                    <td hidden class="state">visible</td>
                    `;

                }
                

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
                    currentRow.querySelector('.td_costPrice').innerText = costPrice;
                    currentRow.querySelector('.td_discount').innerText = discount;
                    currentRow.querySelector(".td_sellingPrice").innerText = sellingPrice
                }

            })

            return

        }

        row.querySelector('.td_Names').innerText = name;
        row.querySelector('.td_Brands').innerText = brand;
        row.querySelector('.td_Category').innerText = category;
        row.querySelector('.td_Stock').innerText = stock;
        row.querySelector('.td_costPrice').innerText = costPrice;
        row.querySelector('.td_discount').innerText = discount;
        row.querySelector(".td_sellingPrice").innerText = sellingPrice


        return true;
    }

    static updateStock(name, brand, category, stock){

        const tableRows = document.querySelector("tbody").querySelectorAll("tr");

        console.log(name, brand, category, stock);
      
        tableRows.forEach((row)=>{

            if(row.querySelector('.td_Name--hidden').innerText === name && row.querySelector('.td_Brand--hidden').innerText === brand && row.querySelector('.td_Category--hidden').innerText === category){

                // currentRow.querySelector('.td_Names').innerText = name;
                // currentRow.querySelector('.td_Brands').innerText = brand;
                // currentRow.querySelector('.td_Category').innerText = category;
                row.querySelector('.td_Stock').innerText = stock;

                return;
            }


        })


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

   static addToCart(row, inCart,btnCart_sell, btnCart_clear, subtractItem){

    /*
     *   ALGORITHM
     *
     * 1. Establish all necessary varaibles (Includes setting dom elements)
     * 2. Hide cartInfo ("no items in cart yet") from dom and enable all buttons acting on the cart
     * 3. Iterate through cartItems and check if incoming item(rowItem) is not already added to the cart. If yes then remove item from cart.
     * 4. If incoming item does not exist in cart then add to cart and show(animation)
     * 
     *
     *
     */

        const tableRows = document.querySelector("tbody").querySelectorAll("tr");

        //Cart Content
        const cart = document.querySelector(".cart");
        const subTotal = cart.querySelector(".subTotal").querySelector(".value")
        const mainTotal = cart.querySelector(".mainTotal").querySelector(".value")
        const cartItemsContainer = document.querySelector(".cart").querySelector(".cartItems");
        const cartInfo = cartItemsContainer.querySelector(".cartInfo");
        const cartItems = cartItemsContainer.querySelectorAll(".cartItem");

        const checkbox = cartItemsContainer.querySelector(".cb_cartItem");




        /*-----------------------------------------------------------------------------------------------*/

        let [rowItemName, rowItemBrand,rowItemCategory, rowItemDiscount, rowItemSellingPrice, rowItemStock, rowItemCostPrice] = [row.querySelector(".td_Name--hidden").innerText, row.querySelector(".td_Brand--hidden").innerText, row.querySelector(".td_Category--hidden").innerText,row.querySelector('.td_discount').innerText, row.querySelector(".td_Price").innerText, row.querySelector('.td_Stock').innerText,  row.querySelector('.td_costPrice').innerText]
        rowItemSellingPrice = parseFloat(rowItemSellingPrice)

        let itemExists = false;
    
      

        //Set "no items in cart yet" invisble
        cartInfo.style.display = "none"

        //disble buttons
        btnCart_clear.disabled = false;
        btnCart_sell.disabled = false


        //Iterate through cart items to remove if already exists
        cartItems.forEach((cartItem)=>{

            if(cartItem.querySelector(".hidden_itemName").innerText === rowItemName && cartItem.querySelector(".hidden_itemBrand").innerText === rowItemBrand && cartItem.querySelector(".hidden_itemCategory").innerText === rowItemCategory ){

                cartItem.classList.remove("cartItem--shown")
                itemExists = true

                setTimeout(()=>{
                    cartItem.remove()
                }, 300)

                subtractItem(cartItem)

                if(cartItems.length === 0){

                    btnCart_clear.disabled = false;
                    btnCart_sell.disabled = false
                    cartInfo.style.display = "block"

                }

            }

        })

        if(itemExists === true){
            return
        }
        else{

            addToCart();


        }


        
        /********************************EVENT LISTENERS*****************************************/


       
    /****************************FUNCTIONS***********************/
    function addToCart(){

        const cartItemTemplate = 
        `
            <div class="cartItem_details">
                <div class="cartItem_Name">${clip(rowItemName, 10)}</div>
                <div class="cartItem_Brand">${clip(rowItemBrand, 10)}</div>
                <div hidden class="hidden_itemCategory">${rowItemCategory}</div>
                <div hidden class="hidden_itemName">${rowItemName}</div>
                <div hidden class="hidden_itemBrand">${rowItemBrand}</div>
            </div>

            <button class="cartItem_discount cartItem_discount--disabled" id="cart_discount${cartItems.length+1}">

                <div class="discountValue">-${rowItemDiscount}%</div>

            </button>

            <input type="checkbox" class="cb_cartItem cartCheckBox" />



        `
        const cartItem = document.createElement("div");
        cartItem.className = "cartItem";

        cartItem.innerHTML = cartItemTemplate;
        
        cartItemsContainer.appendChild(cartItem)


        setTimeout(()=>{

            cartItem.classList.add("cartItem--shown")
            cartItem.scroll({
                behavior: "smooth",
            })


        }, 100)

        let itemCount = parseInt(rowItemStock);
        
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
        cartItemCost.innerText = 
        `GH¢ ${Millify(rowItemSellingPrice,
                {
                    units: ['', 'K', 'M', 'B', 'T', 'P', 'E'],
                    precision: 2
                })
            }`;
        cartItem.appendChild(cartItemCost)

        let currentSubtotal = parseFloat(subTotal.innerText)

        subTotal.innerText = currentSubtotal + rowItemSellingPrice;
        mainTotal.innerText = subTotal.innerText;

        let totalItemSellingPrice = parseFloat(parseInt(itemSelect.value) * parseInt(rowItemSellingPrice))
        let totalItemCostPrice = parseFloat(parseInt(itemSelect.value) * parseInt(rowItemCostPrice))




       inCart.push({
            Item: {
                Name: rowItemName,
                Brand: rowItemBrand,
                Category: rowItemCategory
            },
            Purchased: parseInt(itemSelect.value),
            Revenue: totalItemSellingPrice,
            Profit: totalItemSellingPrice - totalItemCostPrice,
            UnitDiscount: rowItemDiscount,
            TotalDiscount: parseFloat(rowItemDiscount) * parseInt(itemSelect.value)
        })

        const checkbox = cartItem.querySelector(".cartCheckBox");


        //Evt Listeners
        checkbox.addEventListener("click", function toggleDiscount(){

            if(checkbox.checked === true){

                cartItemsContainer.querySelector(`#cart_discount${cartItems.length+1}`).classList.remove("cartItem_discount--disabled")

            }
            else{
                cartItemsContainer.querySelector(`#cart_discount${cartItems.length+1}`).classList.add("cartItem_discount--disabled")
            }

        })

        itemSelect.addEventListener("change", function modifyCost(e){

            let [itemName, itemBrand, itemCategory] = [cartItem.querySelector(".hidden_itemName").innerText, cartItem.querySelector(".hidden_itemBrand").innerText, cartItem.querySelector(".hidden_itemCategory").innerText]
            let newRevenue = 0;

            totalItemSellingPrice = parseFloat(parseInt(itemSelect.value) * parseInt(rowItemSellingPrice))
            totalItemCostPrice = parseFloat(parseInt(itemSelect.value) * parseInt(rowItemCostPrice))

            inCart.forEach((item)=>{

                if(item.Item.Name === itemName && item.Item.Brand === itemBrand && item.Item.Category === itemCategory){

                    item.Purchased = parseInt(itemSelect.value);
                    item.Revenue = totalItemSellingPrice;
                    item.Profit = totalItemSellingPrice - totalItemCostPrice

                }

                newRevenue = parseFloat(item.Revenue + newRevenue);

            })


            let itemQuanity = parseInt(itemSelect.value);
            let totalItemCost = parseFloat(itemQuanity * rowItemSellingPrice).toPrecision(3);

            let currentSubtotal = parseFloat(subTotal.innerText)
            // subTotal.innerText = currentSubtotal + parseFloat(totalItemCost);
            subTotal.innerText = newRevenue;

            mainTotal.innerText = newRevenue

        })

    

    }

  


   }
}


module.exports = DOMCONTROLLER;
