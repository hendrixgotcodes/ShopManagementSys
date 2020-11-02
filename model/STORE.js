const electron = require('electron');
const path = require('path');
const fs =  require('fs');
const { promisify } = require('util');



class STORE{

    constructor(data){

        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        this.path = path.join(userDataPath, data.configName + '.json');

        this.data = parseDataFile(this.path, data.defaults);


    }

    get(key){

        return new Promise((resolve, reject)=>{

                resolve(this.data[key]);

        })

    }

    set(key, val){

        return new Promise((resolve, reject)=>{

            console.log("initiated");

            this.data[key] = val;


                //  const writeFileSync = promisify(fs.writeFileSync);

            fs.writeFileSync(this.path, JSON.stringify(this.data));

            const writeFile = promisify(fs.writeFile);

            writeFile(this.path, JSON.stringify(this.data))
            .then(()=>{

                let date = new Date();

                console.log("finished ", date.getSeconds(), date.getMilliseconds());

                resolve();

            })


        })

        
    }


}

function parseDataFile(filePath, defaults){


    try{

        return JSON.parse(fs.readFileSync(filePath))
    }
    catch(error){
        console.log(error);
        return defaults;
    }
        
}

module.exports = STORE;