import {parseCommandLineArgs} from "./cli";
import {generate} from "./lib";

(async function main(){
    let args = process.argv.slice(2);
    let {name, data, dest} = parseCommandLineArgs(args);
    try {
        await generate(name, data, dest)
    } catch (err){
        console.log(err);
        process.exit(1);
    }
})();
