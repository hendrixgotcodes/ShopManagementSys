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

                console.log(LostAccounts);

                if(LostAccounts === undefined){

                    let array = [userName];
        
                    LostAccounts = {
                        defaults: array
                    }
        
                }
                else{

                    console.log(LostAccounts);

                    LostAccounts.push(userName)
                }
        
                super.set("LostAccounts", LostAccounts)
                .then(()=>{
                    resolve();
                })

            })

        })

    } 

    delete(key){

        let LostAccounts = super.get(key);

        if(LostAccounts !== null){

            LostAccounts.defaults.forEach((user, userIndex)=>{

                if(user.UserName === key){
                    defaults.splice(userIndex, 1)
                }

            })
            

        }

        super.set("LostAccounts", LostAccounts)


    }

}

module.exports = ACCOUNTREPORTER;