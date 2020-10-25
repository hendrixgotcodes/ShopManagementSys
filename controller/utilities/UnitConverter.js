class UnitConverter{

    static convert(value){

        value = Number.parseFloat(value);

        if(value >= 1000){
            value =  (value / 1000).toFixed(2) + ' K';
        }
        else if(value >= 1000000){
            value = (value / 1000000).toFixed(2) + ' M';
            
            console.log(value);
        }
        else if(value >= 1000000000){
            value = (value / 1000000000).toFixed(2) + ' B';

            console.log(value);
        }
        else{
            value = value.toFixed(2)

            console.log(value);
        }
       

        return value;



    }

}

module.exports = UnitConverter;