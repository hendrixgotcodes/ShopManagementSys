// const Dexie = require('dexie').default
const mariadb = require('mysql2');
const cryptoJS = require('crypto-js');
const { offset } = require('@popperjs/core');

class DATABASE{


    constructor(){

            this.connector = mariadb.createConnection({
                host: 'localhost',
                user: 'shop_keeper',
                password: '341591a9-ce19-4abf-8392-ca463bc6caef',
                database: 'shop_keeper'
            });
    
            this.connector.connect((error)=>{            
    
                    let createItemsTableSQL = `CREATE TABLE IF NOT EXISTS items(
                        id INT AUTO_INCREMENT NOT NULL,
                        Name VARCHAR(255) NOT NULL ,
                        Brand VARCHAR(255) NOT NULL,
                        Category VARCHAR(255) NOT NULL,
                        CostPrice DECIMAL(8,2) NOT NULL,
                        SellingPrice DECIMAL(8,2) NOT NULL,
                        InStock INT NOT NULL,
                        Discount INT NOT NULL,
                        Deleted BOOLEAN NOT NULL,
                        ReOrderLevel INT NOT NULL,
                        UNIQUE(Name, Brand, Category),
                        PRIMARY KEY (id),
                        FOREIGN KEY (Brand) REFERENCES itemBrands(Name),
                        FOREIGN KEY (Category) REFERENCES  itemCategories(Name)
                    )`
    
                    let createUserTableSQL = 
                    `
                        CREATE TABLE IF NOT EXISTS  users
                        (
                            id INT AUTO_INCREMENT NOT NULL,
                            First_Name TEXT(255) NOT NULL,
                            Last_Name TEXT(255) NOT NULL,
                            User_Name VARCHAR(255) NOT NULL,
                            Password VARCHAR(255) NOT NULL,
                            IsAdmin BOOLEAN NOT NULL,
                            Last_Seen DATETIME,
                            UNIQUE(User_Name),
                            PRIMARY KEY (id)
                        )

                    `
                    let createBrandTableSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  itemBrands
                        (
                            Name VARCHAR(255) NOT NULL,
                            PRIMARY KEY(Name)
                        )

                    `
                    const createCategoriesSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  itemCategories
                        (
                            Name VARCHAR(255) NOT NULL, 
                            PRIMARY KEY(Name)
                        )
                    `
    
                    const createAuditTrailTableSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  auditTrails
                        (
                            id INT AUTO_INCREMENT NOT NULL,
                            Date DATETIME NOT NULL,
                            User INT NOT NULL,
                            Operation VARCHAR(255) NOT NULL,
                            Item INT NOT NULL,
                            PRIMARY KEY(id),
                            FOREIGN KEY (User) REFERENCES  users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                            FOREIGN KEY (Item) REFERENCES  items(id) ON DELETE CASCADE ON UPDATE CASCADE
                        )

                    `
                    const createSalesTableSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  sales
                            (
                                id INT AUTO_INCREMENT NOT NULL,
                                Date DATE NOT NULL,
                                User INT NOT NULL, 
                                Item INT NOT NULL,
                                Purchased INT NOT NULL,
                                Revenue DECIMAL(8,2) NOT NULL,
                                Profit DECIMAL(8,2) NOT NULL,
                                UnitDiscount DECIMAL(8,2) NOT NULL,
                                TotalDiscount DECIMAL(8,2) NOT NULL,
                                PRIMARY KEY(id),
                                FOREIGN KEY (User) REFERENCES  users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                                FOREIGN KEY (Item) REFERENCES  items(id) ON DELETE CASCADE ON UPDATE CASCADE
                            )

                    `
                    const createItemAuditTrailSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  itemAuditTrails
                        (
                            Item INT NOT NULL,
                            AuditTrail INT NOT NULL,
                            FOREIGN KEY (AuditTrail) REFERENCES  AuditTrails(id) ON DELETE CASCADE ON UPDATE CASCADE,
                            FOREIGN KEY (Item) REFERENCES  items(id) ON DELETE CASCADE ON UPDATE CASCADE
                        )

                    `

                    const createUserSalesSQL =
                    `
                        CREATE TABLE IF NOT EXISTS  UserSales
                        (
                            User INT NOT NULL,
                            Sales INT NOT NULL,
                            FOREIGN KEY(User) REFERENCES  users(id) ON DELETE CASCADE ON UPDATE CASCADE,
                            FOREIGN KEY(Sales) REFERENCES  sales(id) ON DELETE CASCADE ON UPDATE CASCADE
                        )
                    `
                    const createReportedAccountsSQL = 
                    `
                        CREATE TABLE IF NOT EXISTS  ReportedAccounts
                        (
                            User_Name VARCHAR(255) NOT NULL,
                            FOREIGN KEY(User_Name) REFERENCES  users(User_Name) ON DELETE CASCADE ON UPDATE CASCADE
                        )

                    `
    
    
                   
                    if(error){

                        throw error

                    }
                    else{

                        this.connector.beginTransaction((error)=>{

                            if(error){
                                throw error
                            }
                            else{
                                
                                this.connector.query(createBrandTableSQL, ()=>{

                                    if(error !== null){

                                        this.connector.rollback(()=>{
                                            console.log("error");
                                            throw error
                                        })

                                    }
                                    else{

                                        this.connector.query(createCategoriesSQL, (error)=>{

                                            if(error !== null){
                                                this.connector.rollback(()=>{
                                                    console.log("error");
                                                    throw error
                                                })
                                            }
                                            else{

                                                this.connector.query(createUserTableSQL, (error)=>{

                                                    if(error !== null){
                                                        this.connector.rollback(()=>{
                                                            console.log("error");
                                                            throw error
                                                        })
                                                    }
                                                    else{

                                                        this.connector.query(createItemsTableSQL, (error)=>{

                                                            if(error !== null){

                                                                this.connector.rollback(()=>{
                                                                    console.log("error");
                                                                    throw error
                                                                })
                                                            }
                                                            else{

                                                                this.connector.query(createSalesTableSQL, (error)=>{
                                                                
                                                                    if(error){

                                                                        this.connector.rollback(()=>{
                                                                            console.log("error");
                                                                            throw error
                                                                        })
                                                                    }
                                                                    else{
                                                                        this.connector.query(createAuditTrailTableSQL, (error)=>{
                                                                
                                                                            if(error){

                                                                                this.connector.rollback(()=>{
                                                                                    console.log("error");
                                                                                    throw error
                                                                                })
                                                                            }
                                                                            else{
                                                                                

                                                                                this.connector.query(createItemAuditTrailSQL, (error)=>{

                                                                                    if(error){

                                                                                        this.connector.rollback(()=>{
                                                                                            console.log("error");
                                                                                            throw error
                                                                                        })
                                                                                    }
                                                                                    else{
                                                                                        this.connector.query(createUserSalesSQL, (error)=>{

                                                                                            if(error){

                                                                                                this.connector.rollback(()=>{
                                                                                                    console.log("error");
                                                                                                    throw error
                                                                                                })
                                                                                            }
                                                                                            this.connector.query(createReportedAccountsSQL, (error)=>{

                                                                                                if(error){
        
                                                                                                    this.connector.rollback(()=>{
                                                                                                        console.log("error");
                                                                                                        throw error
                                                                                                    })
                                                                                                }
                                                                                                else{
                                                                                                    
                                                                                                    this.connector.query("SELECT COUNT(*) AS Count FROM `users`", (error, result)=>{

                                                                                                        

                                                                                                        if(error){
                                                                                                            throw error
                                                                                                        }
                                                                                                        else{
                                                                                                            
                                                                                                            console.log(result);


                                                                                                            result = result.pop();
                                                                                                            
                                                                                                            if(result.Count === 0){

                                                                                                                this.connector.query("INSERT INTO `users` SET ?", {First_Name: "admin", Last_Name: "admin", User_Name: "admin", Password: "U2FsdGVkX1+1/HhsPvFWOKBvsPBE1J0Re3XDWquuZeU="}, (error, result)=>{

                                                                                                                    if(error){
                                                                                                                        this.connector.rollback();
                                                                                                                        throw error;
                                                                                                                    }
                                                                                                                    else{
                                                                                                                        this.connector.commit((error)=>{
                                                                                                                            if(error){
                                                                                                                                throw error;
                                                                                                                            }
                                                                                                                        })
                                                                                                                    }

                                                                                                                })

                                                                                                            }



                                                                                                        }

                                                                                                            

                                                                                                        
                                                                                                    })

                                                                                                }

                                                                                            })

                                                                                        })
                                                                                    }

                                                                                })

                                                                            }

                                                                        })
                                                                    }

                                                                })

                                                            }

                                                            

                                                        })

                                                    }

                                                })

                                            }

                                        })
                                    }

                                })

                                        

                            
            

                            }

                        })

                    }
    
                    
                        
    
            })


    }


/*************************SINGLE OBJECT OPERATIONS******************************/
    addNewItem(shopItem, userName){


        return new Promise((resolve, reject)=>{

            const array = Object.values(shopItem)
            let [name, brand, category, stock, sellingPrice, costPrice, discount] = array;

            let insertCategorySQL = `INSERT INTO  itemCategories SET ? `
            let categoryValues = {
                Name: category
            }
    

            let insertBrandSQL = `INSERT INTO  itemBrands SET ? `
            let brandValues = {
                Name: brand
            }
        
            let insertItemSQL = "INSERT INTO  items SET ? ON DUPLICATE KEY UPDATE ?";
            let values = 
            {
                    Name: name,
                    Brand: brand,
                    Category: category,
                    InStock: stock,
                    CostPrice: costPrice,
                    SellingPrice: sellingPrice,
                    Discount: discount,
                    Deleted: false
            }
            ;

            let updateValues ={
                InStock: stock,
                CostPrice: costPrice,
                SellingPrice: sellingPrice,
                Discount: discount
            }
                
            
            this.connector.beginTransaction((error)=>{

                if(error){
                    throw error
                }
                else
                {

                        this.connector.query(insertCategorySQL, categoryValues, (error, result)=>{

                                       
                            if( error === null || error.code === "ER_DUP_ENTRY" ){
        
                                this.connector.query(insertBrandSQL, brandValues, (error, result)=>{
        
                                        
                                        if( error === null || error.code === "ER_DUP_ENTRY"){
        
                                            this.connector.query(insertItemSQL, [values, updateValues], (error, result)=>{
        
                                                let itemId = result.insertId;
        
                                                if(error){
        
        
                                                    if(error.code === "ER_DUP_ENTRY"){
        
                                                        this.connector.rollback(function(){
        
                                                            reject("duplicate")
                                                            throw error
        
                                                        })
                                                    }
                                                    else{
                                                        this.connector.rollback(function(){
        
                                                            reject("unknown error")
                                                            throw error
        
                                                        })
                                                    }
                    
                                                }
                                                else{


                                                    this.connector.query(`SELECT * FROM  users WHERE User_Name = '${userName}'`, (error, result)=>{


                                                        let user = result.shift();


                                                        if(error){

                                                           

                                                            this.connector.rollback(()=>{

                                                                reject("unknown error")

                                                                throw error

                                                            })

                                                        }
                                                        else if(result === null){

                                                            this.connector.rollback(()=>{

                                                                reject("unknow user")
                                                                throw new Error("unknown user")

                                                            })

                                                        }
                                                        else if(error === null || error.code === "ER_DUP_ENTRY"){

                                                            let item = result;
        
                                                            const Today = new Date();
        
                                                            let auditTrailValues = 
                                                            {
                                                                Date: `${Today.getFullYear()}-${Today.getMonth()+1}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                                User: user.id,
                                                                Operation: "Creation",
                                                                Item: itemId
                                                            }
                
                                                            this.connector.query("INSERT INTO  auditTrails SET ?", auditTrailValues, (error, result)=>{
        
                                                                if(error){
        
                                                                    this.connector.rollback(function(){
                
                                                                        reject("unknown error")
                                                                        throw error
                    
                                                                    })
        
                                                                }
                                                                else{
        
                                                                    let itemAuditTrailValues ={
                                                                        Item: itemId,
                                                                        AuditTrail: result.insertId
                                                                    }
        
                                                                    this.connector.query("INSERT INTO  itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{
                                                                        
        
                                                                        if(error){

                                                                            this.connector.rollback(()=>{

                                                                                reject("unknown error")
        
                                                                                throw error

                                                                            })
                                                                           
                                                                        }
                                                                        else{
        
                                                                            this.connector.commit(function(error){
                
                                                                                if(error){
                                                                                    reject("unknown error")
                                                                                    throw error
                                                                                }
                                
                                                                                resolve(true)
                                
                                                                            })
        
                                                                        }
        
                                                                    })
        
                                                                }
        
                                                            })
                
                                                        }

                                                    })

                                                }

        
                                            })
                                        }
                                        else if(error !== null || error.code !== "ER_DUP_ENTRY"){
        
                                            reject("unknown error")
                                            throw error
        
                                        }
        
                                })
                            }
                            else if(error !== null || error.code !== "ER_DUP_ENTRY"){
        
                                reject("unknown error")
                                throw error
        
                            }
        
                            
        
                        })
        
                }
                        
               

            })

            

        })

    }


    updateItem(change, User){
       

        return new Promise((resolve, reject)=>{


            let update = {
                InStock: change.InStock,
                CostPrice: change.CostPrice,
                SellingPrice: change.SellingPrice,
                Discount: change.Discount
            }

            

            let updateItemSQL = `UPDATE  items SET ? WHERE Name = '${change.Name}' AND Brand = '${change.Brand}' AND Category = '${change.Category}'`;
            

                       
            this.connector.beginTransaction((error)=>{

                if(error){
                    reject("unknown error")
                    throw error
                }
                else{

                    this.connector.query(updateItemSQL, update,(error, result)=>{

                        if(error){

                            this.connector.rollback(()=>{

                                if(error.code === "ER_DUP_ENTRY"){
                                    reject(new Error("ERR_DUP_ENTRY"))
                                }
                                else{
                                    reject(new Error("unknown error"))
            
                                }
            
                                throw error

                            })
        
        
        
                        }
                        else{

                            console.log(change.Name, change.Brand, change.Category);

                            this.connector.query(`SELECT * FROM  items WHERE Name = '${change.Name}' AND Brand = '${change.Brand}' AND Category = '${change.Category}'`,((error, result)=>{


                                if(error){



                                    this.connector.rollback(()=>{

                                        reject("unknown error")

                                        throw error

                                    })

                                }
                                else{

                                    console.log(result);


                                    const item = result.shift();
                                    const itemId = item.id;
    

                                    this.connector.query(`SELECT * FROM  users WHERE User_Name = '${User}'`, (error, result)=>{
        
        
                                        let user = result.shift();
                                        let userId = user.id;
        
                                        if(error){
                                            this.connector.rollback(()=>{
        
                                                reject("unknown error")
                                                throw error
        
                                            })
                                        }
                                        else if(result === null){
                                            this.connector.rollback(()=>{

                                                reject("unknown user")
                                                throw new Error("unknow user")

                                            })
                                        }
                                        else{
        
                                            const Today = new Date();

                                            let auditTrailValues = 
                                            {
                                                Date: `${Today.getFullYear()}-${Today.getMonth()+1}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                User: userId,
                                                Operation: "Edit",
                                                Item: itemId
                                            }
                
                                            this.connector.query("INSERT INTO  auditTrails SET ?", auditTrailValues, (error, result)=>{
                
                                                if(error){
                
                                                    this.connector.rollback(()=>{
                
                                                        reject("unknown error")
                                                        throw error
                
                                                    })
                
                
                                                }
                                                else{

                                                    let itemAuditTrailValues = {
                                                        Item : itemId,
                                                        AuditTrail: result.insertId
                                                    }
                
                                                    this.connector.query("INSERT INTO  itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{
                
                                                        if(error){
                
                                                            this.connector.rollback(()=>{
                
                                                                reject("unknown error")
                                                                throw error
                
                                                            })
                
                                                        }
                                                        else{
                
                                                            this.connector.commit((error)=>{
                
                                                                if(error){
                                
                                                                    reject("unknown error")
                                
                                                                    throw error
                                                                }
                                
                                                                resolve(true)
                                
                                
                                                            })
                
                                                        }
                
                                                    })
                
                                                }
                
                                            })
                        
                                            
        
                                        }
        
                                    })
        
        
                                }

                            }))

                        }
   
        
                    })


                }

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


    recoverItem(shopItem){

        return new Promise((resolve, reject)=>{

            let matchedItem;
            

            this.db.items.where(shopItem).each((item)=>{

                // item.Deleted = "true";

                // this.db.items.put(item);
                matchedItem = item;

            })
            .then(()=>{

                matchedItem.Deleted = "false"
                this.db.items.put(matchedItem)

                resolve(true)
            })
            .catch(()=>{
                reject(false)
            })


       })

    }

    getTotalItems(){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT COUNT(*) FROM `items`", (error, result)=>{

                if(error){
                    reject(error)
                    throw error;
                }

                resolve(result);

            })

        })

    }

    fetchItems(){        

        return new Promise((resolve, reject)=>{


            this.connector.query("SELECT * FROM  items ORDER BY Name ASC LIMIT 200", (error, results)=>{
                
                if(error){

                    if(error.code === "ECONNREFUSED"){
                        reject(error.code)
                    }
                    else{

                        reject(new Error("database not found"))

                    }

                }
                else{
                    resolve(results)

                }

            })


        })

    }

    paginateRemainingItems(offset){

        return new Promise((resolve, reject)=>{


            this.connector.query(`SELECT * FROM  items ORDER BY Name ASC LIMIT ${offset}, 200`, (error, results)=>{
                
                if(error){

                    if(error.code === "ECONNREFUSED"){
                        reject(error.code)
                    }
                    else{

                        reject(new Error("database not found"))

                    }

                }
                else{
                    resolve(results)
                }

            })


        })


    }

    getItemStock(item){

        let totalStock

        return new Promise((resolve, reject)=>{

            this.db.items.get(item, (returnedItem)=>{

                totalStock = returnedItem.Stock;

                resolve(totalStock);
    
            })

        })


    }

    updateItemStock(item, newStock){

        return new Promise((resolve, reject)=>{

            this.db.items.get(item, (returnedItem)=>{

                returnedItem.Stock = newStock;
    
                let itemIndex = returnedItem.id;
    
                this.db.items.delete(itemIndex).
                then(()=>{
                    this.db.items.put(returnedItem)

                    resolve();
                })
    
            })

        })

    }


    getItemSalesMade(item){

        let salesMade

        return new Promise((resolve, reject)=>{

            this.db.items.get(item, (returnedItem)=>{

                if(returnedItem.SalesMade !== null || returnedItem.SalesMade !== "")
                {

                    salesMade = returnedItem.SalesMade;

                }


                resolve(totalStock);
    
            })

        })


    }

    updateItemSalesMade(item, salesMade){

        return new Promise((resolve, reject)=>{

            this.db.items.get(item, (returnedItem)=>{

                returnedItem.SalesMade = salesMade;
    
                let itemIndex = returnedItem.id;
    
                this.db.items.delete(itemIndex).
                then(()=>{
                    this.db.items.put(returnedItem)

                    resolve();
                })
    
            })

        })

    }


    addItemsBulk(itemArray, User){

       

        return new Promise((resolve, reject)=>{           

            let inDb = [];

           

           itemArray.forEach((item)=>{


                this.connector.query("SELECT * FROM items WHERE Name = ? AND Brand = ? AND Category = ?", [item.Name, item.Brand, item.Category], (error, result)=>{

                    if(error){

                        reject("unknown error")
                        throw error

                    }

                    result.forEach((dbItem)=>{

                        item.InStock = parseInt(dbItem.InStock) + parseInt(item.InStock)

                        dbItem.InStock = item.InStock;

                        inDb.push(dbItem)
                        

                    })


                })

           }) 

            itemArray.forEach((item)=>{

                this.connector.beginTransaction((error)=>{

                    if(error){
                        reject(error)
                        throw error
                    }

                    this.connector.query(`INSERT INTO  itemBrands SET Name = '${item.Brand}'`, (error)=>{

                        if(error === null || error.code === "ER_DUP_ENTRY"){

                            this.connector.query(`INSERT INTO  itemCategories SET Name='${item.Category}' ON DUPLICATE KEY UPDATE Name= '${item.Category}'`, (error)=>{


                                    this.connector.query("INSERT INTO  items SET ? ON DUPLICATE KEY UPDATE ?", [item, item], (error, result)=>{

                                        if(error){

                                                this.connector.rollback(()=>{

                                                    if(error.code === "ER_DUP_ENTRY"){
                                                        reject("Duplicate")
                                                    }
                                                    else{

                                                        reject("unknown error")
                                                        throw error

                                                    }


                                                })


                                        }
                                        else{


                                            const itemId = result.insertId;


                                            this.connector.query(`SELECT * FROM users WHERE User_Name = '${User}'`, (error, result)=>{

                                                if(error){

                                                    this.connector.rollback(()=>{

                                                        reject("unknown error");
                                                        throw error

                                                    })

                                                }
                                                else{
                                                    

                                                    let user = result.shift();
                                                    let userId = user.id;




                                                    const Today = new Date();

                                                    let auditTrailValues = 
                                                    {
                                                        Date: `${Today.getFullYear()}-${Today.getMonth()+1}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                        User: userId,
                                                        Operation: "Creation",
                                                        Item: itemId
                                                    }

                                                    this.connector.query("INSERT INTO  auditTrails SET ?", auditTrailValues, (error, result)=>{

                                                    
                                                        if(error){

                                                            this.connector.rollback(()=>{
        
                                                                reject("unknown error");
                                                                throw error
        
                                                            })
        
                                                        }
                                                        else{

                                                            let itemAuditTrailValues = {
                                                                item: itemId,
                                                                auditTrail: result.insertId
                                                            }

                                                            this.connector.query("INSERT INTO  itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{

                                                                if(error){

                                                                    this.connector.rollback(()=>{
                
                                                                        reject("unknown error");
                                                                        throw error
                
                                                                    })
                
                                                                }
                                                                else{

                                                                    this.connector.commit((error)=>{

                                                                        if(error)
                                                                        {
                                                                            reject("unknown error")
                                                                            
                                                                            throw error
                                                                        }
                                                                        else{
                                                                            resolve([itemArray, inDb])
                                                                        }


                                                                    })

                                                                }

                                                            })

                                                        }


                                                    })

                                                }

                                                })    

                                        }

                                    })


                            })

                        }
                        else if(error){

                            this.connector.rollback(()=>{

                                reject("unknown error")
                                throw error


                            })
                        }

                    })

                })

             })
        


            


        })
       
    }




    /*****************************CATEGORIES DB METHODS************************************/
    getAllItemCategories(){

       return new Promise((resolve, reject)=>{


            this.connector.query("SELECT * FROM  itemCategories", (err, result)=>{

                if(err){
                    console.log(err);
                }
                else{

                    resolve(result)

                    console.log(result);

                }

            })


       })
        

    }

    getAllItemBrands(){

        return new Promise((resolve, reject)=>{
 
            this.connector.query("SELECT * FROM  itemBrands", (err, result)=>{

                if(err){
                    console.log(err);
                }
                else{

                    resolve(result)

                }

            })
 
        })
         
 
     }
 


    /****************************USER DB METHODS*******************************************/
    
    
    addNewUser(userInfo){

        return new Promise((resolve, reject)=>{

            this.connector.query("INSERT INTO `users` SET ?", userInfo, (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }
                else{

                    console.log(result);

                    resolve()

                }

            })

        })

    }

    updateUserInfo(userName, password){

        return new Promise((resolve, reject)=>{

            this.connector.query("UPDATE `users` SET ? WHERE ?", [{Password: password}, {User_Name: userName}], (error, result)=>{

                if(error){

                    reject(error)
                    throw error
                }

                resolve(result)

            })


        })


    }

    makeSale(newSale,userName){

       return new Promise((resolve, reject)=>{


            const today = new Date();

             newSale.forEach((sale)=>{


                let [itemName, itemBrand, itemCategory] = [sale.Item.Name, sale.Item.Brand, sale.Item.Category];

                sale.Date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;

                let finalSaleValue = {

                    Date: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
                    Purchased: sale.Purchased,
                    Revenue: sale.Revenue,
                    Profit: sale.Profit,
                    UnitDiscount: sale.UnitDiscount,
                    TotalDiscount: sale.TotalDiscount

                }

                console.log(finalSaleValue);



                let userValue = {
                    User_Name: userName
                }

                this.connector.query("SELECT id FROM `users` WHERE ?", userValue ,(error, result)=>{

        
                    if(error){
                        reject('unknown error')
                        throw error
                    }
                    else{
                        const user = result.shift();
                        const userId = user.id;
                        finalSaleValue.User = userId;


                        this.connector.query("SELECT * FROM `items` WHERE Name = ? AND Category = ? AND Brand = ?", [itemName, itemCategory, itemBrand],(error, result)=>{
    
                            if(error){
    
                                reject("unknown error")
                                throw error
                                
                            }
                            else{

                                const item = result.shift();
                                finalSaleValue.Item = item.id;

                                let InStock = item.InStock;

                                InStock = InStock - finalSaleValue.Purchased;

    
                                this.connector.beginTransaction((error)=>{
    
                                    if(error){
                                        reject("unknown error")
                                        throw error
                                    }
                                    else{

                                        this.connector.query("INSERT INTO  sales SET ?", finalSaleValue, (error, result)=>{
    
                                            if(error){
    
                                                this.connector.rollback(()=>{
    
                                                    reject("unknown error")
                                                    throw error
    
                                                })
                                                
                                            }
                                            else{

                                                let userSaleValue = {
                                                    User: userId,
                                                    Sales: result.insertId
                                                }
            
                                                this.connector.query("INSERT INTO  UserSales SET ?", userSaleValue, (error)=>{
    
                                                    if(error){
    
                                                        this.connector.rollback(()=>{
    
                                                            reject("unknown error")
                                                            throw error
    
                                                        })
    
                                                    }
                                                    else{

                                                       
                                                        this.connector.query(`UPDATE  items SET InStock = '${InStock}' WHERE Name='${itemName}' AND Brand='${itemBrand}' AND Category='${itemCategory}'`, (error)=>{

                                                            if(error){
                                                                this.connector.rollback(()=>{

                                                                    reject("unknown error")
                                                                    throw error

                                                                })
                                                            }
                                                            else{

                                                                this.connector.commit(()=>{

                                                                    resolve(true)

                                                                })

                                                            }

                                                        })

                                                    }
    
                                                })
            
                                            }
            
                                        })
    
                                    }
    
                                })
    
                            }
    
                        })
    
                    }
    
                })
    

            })

       })

    }

    validateUser(userName, incomingPassword){

        // userName = userName.replace(/^\s+|\s+$/g, "")
        // console.log("userName: ", userName, " Password: ", Password);

        return new Promise((resolve, reject)=>{


            this.connector.query("SELECT * FROM users WHERE User_Name = ?", userName,  (error, result)=>{


                if(error){
                    reject(error)
                    throw error
                }
                else if(result){

                    let user = result.shift();

                    if(user === undefined){
                        reject("incorrect username")
                    }
                    else if(user){

                        let storedPassword = user.Password;

                        verifyPassword(userName, incomingPassword, storedPassword)
                        .then((result)=>{

                            if(result === true){
                                
                                if(user.IsAdmin === 1){
                                    resolve([user.User_Name, "Admin"])
                                }
                                else if(user.IsAdmin !== 1){
                                    resolve([user.User_Name, "Employee"])
                                }  

                            }
                            else{
                                reject("incorrect password")
                            }

                        })


                    }
                    


                }

    
            })

        })

    }


    /******************FOR GRAPH */
    getSaleRecords(from, to){

        return new Promise((resolve, reject)=>{

            let days = []
            let revenues = [];
            let colors = [];
            let grossRevenue = 0;
            let grossProfit = 0;
            let totalSalesMade = 0;
            let itemsSold = 0;

            this.connector.query("SELECT Date, DAYNAME(Date) Day, SUM(Revenue) Revenue, SUM(Profit) Profit, COUNT(id) SalesMade, SUM(Purchased) ItemsSold From `sales` WHERE Date BETWEEN ? AND ? GROUP BY Date ORDER BY Date DESC", [from, to], (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }
                
            
                result.forEach((item)=>{

                    days.push(`${item.Day}`)
                    revenues.push(parseFloat(item.Revenue))

                    grossRevenue = grossRevenue + parseFloat(item.Revenue)
                    grossProfit = grossProfit + parseFloat(item.Profit);
                    totalSalesMade = totalSalesMade + parseFloat(item.SalesMade);
                    itemsSold = itemsSold + parseInt(item.ItemsSold);

                    colors.push(`hsl(${randomNumber(0, 360)}, ${randomNumber(80, 100)}%, ${randomNumber(60, 70)}%)`)

                })

                resolve([days, revenues,grossRevenue, grossProfit, totalSalesMade, itemsSold, colors])

            })


        })

        function randomNumber(min, max){

            min = Math.ceil(min);
            max = Math.floor(max);

            return Math.floor(Math.random() * (max - min) + min);

        }
        
    }

    getItemQuantity(itemName, itemBrand, itemCategory){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT InStock FROM `items` WHERE Name = ? AND Brand = ? AND Category = ?", [itemName, itemBrand, itemCategory], (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }
                
                resolve(result)

            })


        })

    }

    getTopItems(from, to){

        return new Promise((resolve, reject)=>{

            const items = []

            this.connector.query("SELECT Item ItemID, SUM(Purchased) Sold, SUM(Profit) Profit FROM `sales` WHERE Date BETWEEN ? AND ? GROUP BY Item ORDER BY COUNT(Item) DESC LIMIT 3", [from, to], (error, topItemResult)=>{

                if(error){
                    reject(error)
                    throw error
                }
                else{

                    topItemResult.forEach((topItem)=>{


                        this.connector.query("SELECT * FROM items WHERE id = ?", topItem.ItemID, (error, result)=>{

                                
                            if(error){
                                reject(error)
                                throw error
                            }

                            result.forEach((item)=>{

                                items.push({
                                    Name: item.Name,
                                    Brand: item.Brand,
                                    Category: item.Category,
                                    Sold: topItem.Sold,
                                    Profit: topItem.Profit
                                })

                                resolve(items)

                            })

                        })


                    })


                }

            })

        })
        
    }

    getUser(userName){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT First_Name, Last_Name, User_Name FROM users WHERE ?", {User_Name: userName}, (error, result)=>{

                if(error){
                    
                    reject(error)
                    throw error

                }

                resolve(result)

            })

        })

    }

    getUsers(){

       return new Promise((resolve, reject)=>{           

            this.connector.query('select First_Name, Last_Name, IsAdmin, TIMEDIFF(CURRENT_TIMESTAMP(), Last_Seen) AS Last_Seen, (select sum(`sales`.`Profit`) from `sales` sales where `sales`.`User` = `users`.`id`) as Total_Profits, (SELECT COUNT(*) FROM `sales` WHERE `sales`.`user` = `users`.`id`) as Total_Sales from `users` users', (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                resolve(result);

            })


       })
        

    }

    getUserTotalSaleToday(user){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT id FROM `users` WHERE ?", {User_Name: user}, (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                result = result.pop();

                this.connector.query("SELECT SUM(Revenue) Revenue FROM `sales` WHERE ? AND Date BETWEEN TIMESTAMP(CURRENT_DATE) AND TIMESTAMP(CURRENT_TIME)",{User: result.id}, (error, result)=>{

                    if(error){
                        reject(error)
                        throw error
                    }

                    resolve(result);

                } )


            })

        })

    }

    getReportedAccounts(){

        return new Promise((resolve, reject)=>{

            let reportedaccounts = [];

            this.connector.query("SELECT * FROM reportedaccounts", (error, results)=>{

                if(error){
                    
                    reject(error)
                    throw error

                }

                results.forEach((result)=>{

                    this.connector.query("SELECT First_Name, Last_Name, User_Name FROM `users` WHERE ?", {User_Name: result.User_Name}, (error, result)=>{

                        if(error){
                            reject(error)
                            throw error
                        }

                        let user = result.shift();

                        reportedaccounts.push(user)

                        resolve(reportedaccounts)

                    })

                })


            })

        })

    }

    getNumberOfReportedAccount(){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT COUNT(User_Name) Total FROM `reportedaccounts`", (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                resolve(result)

            })

        })

    }

    getTotalProfit(){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT SUM(Profit) AS Profit from `sales`", (error, result)=>{

                if(error){
                    reject(error);
                    throw error;
                }
                else{

                    result = result.pop();

                    resolve(result.Profit)

                }

            })

        })

    }

    getDateRangeSales(){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT DATE_FORMAT(MIN(Date), '%Y-%m-%d') AS Minimum, DATE_FORMAT(MAX(Date), '%Y-%m-%d') AS Maximum FROM `sales`",(error, result)=>{

                if(error){
                    reject(error);
                    throw error;
                }
                else{

                    result = result.pop();
                    resolve(result);

                }

            })


        })

    }

    deleteReportedAccount(userName){

        return new Promise((resolve, reject)=>{

            console.log(";;", userName);

            this.connector.query("DELETE FROM `reportedaccounts` WHERE ?", {User_Name: userName}, (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                resolve(result)
                console.log(result);

            })

        })

    }


    setUserLastSeen(userName, lastSeen){

        return new Promise((resolve, reject)=>{

            this.connector.query("UPDATE `users` SET Last_Seen = ? WHERE User_Name =?", [lastSeen, userName], (error, result)=>{

                if(error){
                    reject("error");
                    throw error;
                }

                resolve(result);

            })

        })

    }

    setReportedAccount(userName){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT User_Name FROM `users` WHERE ?", {User_Name: userName}, (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                let user = result.shift();


                if(user === null || user === undefined){

                    reject(new Error("invalid user"))

                }
                else{

                     this.connector.query("INSERT INTO `reportedaccounts` SET ?",{User_Name: user.User_Name}, (error, result)=>{

                        if(error){
            
                            reject(error)
                            throw error
            
                        }
            
                        resolve(result)
        
                    })

                }

            })

           

        })

    }

    getItem(itemName){

        return new Promise((resolve, reject)=>{

            this.connector.query("SELECT * FROM `items` WHERE Name = ?", itemName, (error, result)=>{

                if(error){
                    reject(error)
                    throw error
                }

                resolve(result)

            })

        })

    }
    
                           




}

//FUNCTIONS
function verifyPassword(userName, incomingPassword, storedPassword){

    return new Promise((resolve, reject)=>{

        const decrypted = cryptoJS.AES.decrypt(storedPassword, userName).toString(cryptoJS.enc.Utf8)

        console.log(decrypted, incomingPassword);

        if(incomingPassword === decrypted){

            resolve(true)

        }
        else{
            resolve(false)
        }

    })

}  



module.exports = DATABASE;