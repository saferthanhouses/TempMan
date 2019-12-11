import {parseCommandLineArgs} from "./cli";
import {TemplateLoader} from "./lib/TemplateLoader";

(async function main(){
    let args = process.argv.slice(2);
    let {name, data, dest} = parseCommandLineArgs(args);
    try {
        let changeMap = await (new TemplateLoader(name)).once(TemplateLoader.LOADED);
        console.log({changeMap})
    } catch (err){
        console.log(err);
        process.exit(1);
    }
})();
