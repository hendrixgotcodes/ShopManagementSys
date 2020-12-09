const { defaults } = require("chart.js");
const STORE = require("./STORE");

class ACCOUNTREPORTER extends STORE{

    constructor(){
        super({
            configName: "LostAccounts",
            defaults: {
                LostAccounts:  []
            }
        })

    }

    get(){

        return new Promise((resolve, reject)=>{

            super.get("LostAccounts")
            .then((data)=>{

                resolve(data);

            })

        })

    }

    set(userName){
        
        return new Promise((resolve, reject)=>{

            let LostAccounts;

            super.get("LostAccounts")
            .then((data)=>{

                LostAccounts = data;

                if(LostAccounts === undefined){

                    let array = [userName];
        
                    LostAccounts = {
                        defaults: array
                    }
        
                }
                else{


                    LostAccounts.push(userName)
                }
        
                super.set("LostAccounts", LostAccounts)
                .then(()=>{
                    resolve();
                })

            })

        })

    } 

    delete(UserName){

        

        super.get("LostAccounts")
        .then((data)=>{

            let LostAccounts = data;

            if(LostAccounts !==undefined)
            {

                LostAccounts.forEach((userName, currentIndex)=>{

                    if(userName === UserName){
                        LostAccounts.split(currentIndex, 1)
                    }

                })

            }
    
            super.set("LostAccounts", LostAccounts)

        })


    }

}

module.exports = ACCOUNTREPORTER;