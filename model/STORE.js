const electron = require('electron');
const path = require('path');
const fs =  require('fs');


class STORE{

    constructor(data){

        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        this.path = path.join(userDataPath, data.configName + '.json');

        this.data = parseDataFile(this.path, data.defaults);


    }

    get(key){
        return this.data[key];
    }

    set(key, val){

        return new Promise((resolve, reject)=>{

            this.data[key] = val;

            try {

                fs.writeFileSync(this.path, JSON.stringify(this.data));
                resolve();
                
            } catch (error) {

                this.data[key] = null;
                reject()
                
            }


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