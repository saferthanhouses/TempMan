import {DataInput} from "./types";

export function validate(data: DataInput, varNames: string[]) {
    let dataObject:{[key: string]: string} = {}
    try {
        // If data is an object, check that each of the keys match a variable
        if (typeof data === 'object'){
            let keysMatch = Object.keys(data).every((dataKey) => {
                let index =  varNames.indexOf(dataKey);
                if (~index){
                    varNames.splice(index,1);
                    return true;
                } else {
                    return false;
                }
            });
            if  (!keysMatch) throw Error("Data keys do not match template variables")
            dataObject = {...data}
        } else if (typeof data === 'string'){
            if (varNames.length > 1){
                throw Error("Data keys do not match template variables")
            } else {
                dataObject = {
                    [varNames[0]]: data
                }
            }
        }

        // return Object.keys(dataObject).reduce((accum, next) => {
        //     accum[`#{${next}}`] = dataObject[next];
        //     return accum;
        // }, {} as {[key: string]: string});
        return dataObject
    } catch (err){
        console.log(err.message);
        process.exit(0);
    }
}
