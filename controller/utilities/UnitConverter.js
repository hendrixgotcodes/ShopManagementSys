class UnitConverter{

    static convert(value){

        value = Number.parseInt(value);

        if(value >= 1000){
            value = parseFloat(value / 1000) + ' K';
        }
        else if(value >= 1000000){
            value = parseFloat(value / 1000000) + ' M';
            
            console.log(value);
        }
        else if(value >= 1000000000){
            value = parseFloat(value / 1000000000) + ' B';

            console.log(value);
        }
        else{
            value = parseFloat(value)

            console.log(value);
        }
       

        return value;



    }

}

module.exports = UnitConverter;