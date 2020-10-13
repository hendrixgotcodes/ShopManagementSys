"use strict";


class STOREITEM{

    

    constructor(name, brand, category, inStock, costPrice="", sellingPrice){
        this.name = name;
        this.brand = brand;
        this.category = category;
        this.amountPurchased = amountPurchased;
        this.inStock = inStock;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
    }

    reset() {
        this.name = "";
        this.brand = "";
        this.category = "";
        this.amountPurchased = "";
        this.inStock = "";
        this.costPrice = "";
        this.sellingPrice = "";
    }
}

class SELLINGITEM extends STOREITEM{

    

    constructor(name="", brand="", category="", amountPurchased = "", inStock="", sellingPrice=""){

        super(name, brand, category, inStock, costPrice ="", sellingPrice);

        this.amountPurchased = amountPurchased;
    }

    reset() {
        super.name = "";
        super.brand = "";
        super.category = "";
        this.amountPurchased = "";
        super.inStock = "";
        super.costPrice = "";
        super.sellingPrice = "";
    }

    getALL(){
        return [super.name, super.brand, super.category, this.amountPurchased, super.inStock, super.costPrice, super.sellingPrice]
    }
}

module.exports.STOREITEM = STOREITEM;
module.exports.SELLINGITEM = SELLINGITEM;