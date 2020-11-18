// const Dexie = require('dexie').default
const mariadb = require('mysql2');

class DATABASE{


    constructor(){

            this.connector = mariadb.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'duffykids'
            });
    
            this.connector.connect((error)=>{            
    
                if(error){
    
                    console.log(error.code);
    
    
                        //Query strings
                        let createDBsql = `CREATE DATABASE duffykids`;
                        let createItemsTableSQL = `CREATE TABLE IF NOT EXISTS duffykids.items(
                            id INT AUTO_INCREMENT NOT NULL,
                            Name VARCHAR(255) NOT NULL ,
                            Brand VARCHAR(255) NOT NULL,
                            Category VARCHAR(255) NOT NULL,
                            CostPrice DECIMAL(8,2) NOT NULL,
                            SellingPrice DECIMAL(8,2) NOT NULL,
                            InStock INT NOT NULL,
                            Discount INT NOT NULL,
                            Deleted BOOLEAN NOT NULL,
                            UNIQUE(Name, Brand, Category),
                            PRIMARY KEY (id),
                            FOREIGN KEY (Brand) REFERENCES duffykids.itemBrands(Name),
                            FOREIGN KEY (Category) REFERENCES duffykids.itemCategories(Name)
                        )`
    
                        let createUserTableSQL = 
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.users
                            (
                                First_Name TEXT(255) NOT NULL,
                                Last_Name TEXT(255) NOT NULL,
                                User_Name VARCHAR(255) NOT NULL,
                                Password VARCHAR(255) NOT NULL,
                                Last_Seen DATETIME,
                                PRIMARY KEY (User_Name)
                            )
    
                        `
                        let createBrandTableSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.itemBrands
                            (
                                Name VARCHAR(255) NOT NULL,
                                PRIMARY KEY(Name)
                            )
    
                        `
                        const createCategoriesSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.itemCategories
                            (
                                Name VARCHAR(255) NOT NULL, 
                                PRIMARY KEY(Name)
                            )
                        `
    
                        const createAuditTrailTableSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.auditTrails
                            (
                                id INT AUTO_INCREMENT NOT NULL,
                                Date DATETIME NOT NULL,
                                User VARCHAR(255) NOT NULL,
                                Operation VARCHAR(255) NOT NULL,
                                Item INT NOT NULL,
                                PRIMARY KEY(id),
                                FOREIGN KEY (User) REFERENCES duffykids.users(User_Name),
                                FOREIGN KEY (Item) REFERENCES duffykids.items(id)
                            )
    
                        `
                        const createSalesTableSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.sales
                                (
                                    id INT AUTO_INCREMENT NOT NULL,
                                    Date DATE NOT NULL,
                                    User VARCHAR(255) NOT NULL, 
                                    Item INT NOT NULL,
                                    AmountPurchased INT NOT NULL,
                                    CashMade DECIMAL(8,2) NOT NULL,
                                    ProfitMade DECIMAL(8,2) NOT NULL,
                                    UnitDiscount DECIMAL(8,2) NOT NULL,
                                    TotalDiscount DECIMAL(8,2) NOT NULL,
                                    PRIMARY KEY(id),
                                    FOREIGN KEY (User) REFERENCES duffykids.users(User_Name),
                                    FOREIGN KEY (Item) REFERENCES duffykids.items(id)
                                )

                        `
                        const createItemAuditTrailSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.itemAuditTrails
                            (
                                Item INT NOT NULL,
                                AuditTrail INT NOT NULL,
                                FOREIGN KEY (AuditTrail) REFERENCES duffykids.AuditTrails(id) ON DELETE CASCADE,
                                FOREIGN KEY (Item) REFERENCES duffykids.items(id) ON DELETE CASCADE
                            )

                        `

                        const createUserSalesSQL =
                        `
                            CREATE TABLE IF NOT EXISTS duffykids.UserSales
                            (
                                User VARCHAR(255) NOT NULL,
                                Sales INT NOT NULL,
                                FOREIGN KEY(User) REFERENCES duffykids.users(User_Name),
                                FOREIGN KEY(Sales) REFERENCES duffykids.sales(id)
                            )

                        `
    
    
                        this.connector = mariadb.createConnection({
                            host: 'localhost',
                            user: 'root',
                            password: ''
                        })
    
                        this.connector.beginTransaction((error)=>{
    
                            if(error){
                                throw error
                            }
                            else{
    
                                this.connector.connect((err)=>{
    
                                    if(err){
                                        this.connector.rollback(()=>{


                                        })
                                    }
                                    else{
                                        this.connector.query(createDBsql, (error)=>{

                                            if(error){
                                                this.connector.rollback(()=>{
                                                })
                                            }
            
                                            this.connector = mariadb.createConnection({
                                                host: 'localhost',
                                                user: 'root',
                                                password: '',
                                                database: 'duffykids'
                                            })
            
                                            this.connector.connect((error)=>{
            
                                                if(error){
                                                    console.log(error);
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
                                                                                                                else{
                                                                                                                    this.connector.commit((err)=>{
                                                                                                                        
                                                                                                                        if(error){
                                                                                                                            console.log(err);
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
            
                                            })
            
            
                                        })
                                    }
                                })
            
    
                            }
    
                        })
                        
    
    
                   
                }
                else{
                    console.log("Db connectected successfully.....");
                }
    
            })


    }


/*************************SINGLE OBJECT OPERATIONS******************************/
    addNewItem(shopItem){


        return new Promise((resolve, reject)=>{

            const array = Object.values(shopItem)
            let [name, brand, category, stock, sellingPrice, costPrice, discount] = array;

            let insertCategorySQL = `INSERT INTO duffykids.itemCategories SET ? `
            let categoryValues = {
                Name: category
            }
    

            let insertBrandSQL = `INSERT INTO duffykids.itemBrands SET ? `
            let brandValues = {
                Name: brand
            }
        
            let insertItemSQL = "INSERT INTO duffykids.items SET ?";
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

            // let insertItemAuditTrailSQL = "INSERT INTO duffykids.itemAuditTrails SET ?";
            // let itemAuditTrailValues =
            // {



            // }

            //Sales
            // let insertSalesSQL = "INSERT INTO duffykids.Sales SET ?";
            // const today =  new Date();

            // let salesValues =
            // {
            //     Date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
            //     UserName: "noLimitHendrix",
            //     ItemName: name,
            //     ItemBrand: brand,
            //     ItemCategory: category,
            //     AmountPurchased: 0,
            // }
                
            
            this.connector.beginTransaction((error)=>{

                if(error){
                    throw error
                }
                else
                {

                        this.connector.query(insertCategorySQL, categoryValues, (error, result)=>{

                            console.log("result: ",result);
        
            
                                       
                            if( error === null || error.code === "ER_DUP_ENTRY" ){
        
                                this.connector.query(insertBrandSQL, brandValues, (error, result)=>{
        
        
                                        
                                        
                                        if( error === null || error.code === "ER_DUP_ENTRY"){
        
                                            this.connector.query(insertItemSQL, values, (error, result)=>{
        
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

                                                    let userValue = 
                                                    {
                                                        First_Name: "Samuel",
                                                        Last_Name: "Opoku Asare",
                                                        User_Name: "noLimitHendrix",
                                                        Password: "skype321"
                                                    }


                                                    this.connector.query("SELECT * FROM duffykids.users WHERE User_Name = 'noLimitHendrix'", (error, result)=>{

                                                        console.log(result);

                                                        let user = result.shift();

                                                        console.log(user);

                                                        if(error){

                                                           

                                                            this.connector.rollback(()=>{

                                                                reject("unknown error")

                                                                throw error

                                                            })

                                                        }
                                                        else if(error === null || error.code === "ER_DUP_ENTRY"){

                                                            let item = result;
        
                                                            const Today = new Date();
        
                                                            let auditTrailValues = 
                                                            {
                                                                Date: `${Today.getFullYear()}-${Today.getMonth()}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                                User: user.User_Name,
                                                                Operation: "Creation",
                                                                Item: itemId
                                                            }
                
                                                            this.connector.query("INSERT INTO duffykids.auditTrails SET ?", auditTrailValues, (error, result)=>{
        
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
        
                                                                    this.connector.query("INSERT INTO duffykids.itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{
                                                                        
        
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


    updateItem(change){
       

        return new Promise((resolve, reject)=>{


            let update = {
                InStock: change.InStock,
                CostPrice: change.CostPrice,
                SellingPrice: change.SellingPrice,
                Discount: change.Discount
            }

            

            let updateItemSQL = `UPDATE duffykids.items SET ? WHERE Name = '${change.Name}' AND Brand = '${change.Brand}' AND Category = '${change.Category}'`;
            

                       
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
                                    reject(new Error("UNKNWN_ERR"))
            
                                }
            
                                throw error

                            })
        
        
        
                        }
                        else{

                            console.log(change.Name, change.Brand, change.Category);

                            this.connector.query(`SELECT * FROM duffykids.items WHERE Name = '${change.Name}' AND Brand = '${change.Brand} AND Category = '${change.Category}'`,((error, result)=>{

                                
                                console.log(result);

                                const itemId = result.insertId;


                                if(error){



                                    this.connector.rollback(()=>{

                                        reject("unknown error")

                                        throw error

                                    })

                                }
                                else{

                                    this.connector.query("SELECT * FROM duffykids.users WHERE User_Name = 'noLimitHendrix'", (error, result)=>{
        
        
                                        let user = result.shift();
                                        let userId = user.User_Name;
        
                                        if(error){
                                            this.connector.rollback(()=>{
        
                                                reject("unknown error")
                                                throw error
        
                                            })
                                        }
                                        else{
        
                                            const Today = new Date();

                                            let auditTrailValues = 
                                            {
                                                Date: `${Today.getFullYear()}-${Today.getMonth()}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                User: userId,
                                                Operation: "Edit",
                                                Item: itemId
                                            }
                
                                            this.connector.query("INSERT INTO duffykids.auditTrails SET ?", auditTrailValues, (error, result)=>{
                
                                                if(error){
                
                                                    this.connector.rollback(()=>{
                
                                                        reject("unknown error")
                                                        throw error
                
                                                    })
                
                
                                                }
                                                else{
                
                                                    this.connector.query("INSERT INTO duffykids.itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{
                
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
                                
                                                                console.log(result);
                                        
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


    fetchItems(){        

        return new Promise((resolve, reject)=>{


            this.connector.query("SELECT * FROM duffykids.items", (error, results)=>{
                
                if(error){

                    console.log(error);

                    reject(new Error("database not found"))
                }
                else{
                    console.log(results);
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


    addItemsBulk(itemArray){


        return new Promise((resolve, reject)=>{

            
            // const insertValue = [];

            // itemArray.forEach((item)=>{
    
            //     item = Object.values(item).toString();
    
            //     insertValue.push(item)
    
            // })
    
           itemArray.forEach((item)=>{

                this.connector.beginTransaction((error)=>{

                    this.connector.query(`INSERT INTO duffykids.itemBrands SET Name = '${item.Brand}'`, (error)=>{

                        if(error === null || error.code === "ER_DUP_ENTRY"){

                            this.connector.query(`INSERT INTO duffykids.itemCategories SET Name='${item.Category}'`, (error)=>{

                                if(error === null || error.code === "ER_DUP_ENTRY"){

                                    this.connector.query("INSERT INTO duffykids.items SET ? ON DUPLICATE KEY UPDATE ?", [item,item], (error, result)=>{


                                        const itemId = result.insertId;

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

                                            this.connector.query("SELECT * FROM duffykids.users WHERE User_Name = 'noLimitHendrix'", (error, result)=>{

                                                if(error){

                                                    this.connector.rollback(()=>{

                                                        reject("unknown error");
                                                        throw error

                                                    })

                                                }
                                                else{

                                                    let user = result.shift();
                                                    let userId = user.User_Name;



                                                    const Today = new Date();

                                                    let auditTrailValues = 
                                                    {
                                                        Date: `${Today.getFullYear()}-${Today.getMonth()}-${Today.getDate()} ${Today.getHours()}:${Today.getMinutes()}:${Today.getSeconds()}`,
                                                        User: userId,
                                                        Operation: "Creation",
                                                        Item: itemId
                                                    }

                                                    this.connector.query("INSERT INTO duffykids.auditTrails SET ?", auditTrailValues, (error, result)=>{

                                                       
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

                                                            this.connector.query("INSERT INTO duffykids.itemAuditTrails SET ?", itemAuditTrailValues, (error)=>{

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
                                                                             resolve(itemArray)
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
                                else if(error){

                                    this.connector.rollback(()=>{

                                        reject("unknown error")
                                        throw error

                                    })
        
                                }


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


            this.connector.query("SELECT * FROM duffykids.itemCategories", (err, result)=>{

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
 
            this.connector.query("SELECT * FROM duffykids.itemBrands", (err, result)=>{

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

            this.db.users(userInfo)
            .then(()=>{

                resolve(true)

            })
            .catch(()=>{
                reject(false);
            })

        })

    }

    updateUserInfo(userInfo){

        return new Promise((resolve, reject)=>{

            this.db.users.where({Name: userInfo.FirstName, userInfo})
            .modify(userInfo)


        })


    }




}
module.exports = DATABASE;