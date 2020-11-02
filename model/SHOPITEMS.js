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

    addNewItem(shopItem){

        

        return new Promise((resolve, reject)=>{


            // let array = shopItem.toArray();
            const array = Object.values(shopItem)

            console.log("in addnew: ", array);

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
                SellingPrice: sellingPrice,
                CostPrice: costPrice
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

            let array = shopItem.toArray();

            let name, brand, category;

            [name, brand, category] = array;

            shopItem = {
                Name: name,
                Brand: brand,
                Category: category,
                Deleted: true
            }

            this.db.items.where({Name: name, Brand: brand, Category: category}).modify(shopItem)
            .then(()=>{
                resolve(true)
            })
            .catch(()=>{
                reject(false)
            })


       })

        

    }

    readItems(){
        

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



}

module.exports = SHOPITEMS;