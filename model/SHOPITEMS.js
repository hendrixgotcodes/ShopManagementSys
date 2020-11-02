const Dexie = require('dexie').default

class SHOPITEMS{


    constructor(){
        
       this.db = new Dexie('ShopItems');

       this.db.version(1).stores({
           items: "++id, Name, Brand, Category, Deleted"
       })

       this.db.open().then(()=>{
           console.log("Db created successfully...");
       })
       .catch(()=>{
           console.log("Db failed to create")
       })

    }


/*************************SINGLE ITEMS OPERATIONS******************************/
    addNewItem(shopItem){

        

        return new Promise((resolve, reject)=>{


            // let array = shopItem.toArray();
            const array = Object.values(shopItem)

            let name, brand, category, stock, sellingPrice, costPrice;

            [name, brand, category, stock, sellingPrice, costPrice] = array;

            shopItem = {
                Name: name,
                Brand: brand,
                Category: category,
                Stock: stock,
                SellingPrice: sellingPrice,
                CostPrice: costPrice,
                Deleted: "false"
            }

            
            this.db.items.add(shopItem)
            .then(()=>{
                resolve(true);  
                console.log("Item added to database successfully...");              
            })
            .catch(()=>{
                reject(()=>{
                    reject(false)
                })
            })

        })
        

    }


    updateItem(change){

        return new Promise((resolve, reject)=>{

            let array = change.toArray();

            let name, brand, category, stock, sellingPrice, costPrice;
    
            [name, brand, category, stock, sellingPrice, costPrice] = array;
    
            change = {
                Name: name,
                Brand: brand,
                Category: category,
                Stock: stock,
                CostPrice: costPrice,
                SellingPrice: sellingPrice,
            }

            this.db.items.where({Name: name, Brand: brand, Category: Category})
            .modify(change)
            .then(()=>{
                resolve(true)
            })
            .catch(()=>{
                reject(false)
            })

        })

    }

    softDeleteItem(shopItem){


       return new Promise((resolve, reject)=>{

            let matchedItem;
            

            this.db.items.where(shopItem).each((item)=>{

                // item.Deleted = "true";

                // this.db.items.put(item);
                matchedItem = item;

            })
            .then(()=>{

                matchedItem.Deleted = "true"
                this.db.items.put(matchedItem)

                resolve(true)
            })
            .catch(()=>{
                reject(false)
            })


       })

        

    }

/*****************************MULTIPLE ITEMS OPERATIONS****************/

    fetchItems(){
        

        return new Promise((resolve, reject)=>{

            let dbItems= []

            this.db.items.each((item)=>{

                dbItems.push(item)

            })
            .then(()=>{
                resolve(dbItems);
            })
            .catch(()=>{
                resolve(false)
            })

        })

    }

    addItemsBulk(itemArray){

        return new Promise((resolve, reject)=>{

                const alreadyInDB = [];

                
                itemArray.forEach((item)=>{

                    //Look through Database with the following keys
                    this.db.items.where({Name: item.Name, Brand: item.Brand})
                    .each((item)=>{
    
                        // If a match is found, remove from array
                        let itemIndex =  itemArray.indexOf(item);
                        itemArray.splice(itemIndex, 1);
    
                        //add those items to alreadyInDB array
                        alreadyInDB.push(item)
    
                    })
                    .then(()=>{
                        
                         //then add the rest in itemArray to the database
                         this.db.items.bulkPut(itemArray)
                         .then(()=>{
                             resolve([alreadyInDB, itemArray])
                         })
     
                    })
                    .catch(()=>{
    
                        reject(false);
    
                    })

                })


        })

    }



}

module.exports = SHOPITEMS;