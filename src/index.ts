import {parseCommandLineArgs} from "./cli";

(function main(){
    let args = process.argv.slice(2);
    let {name, data, dest} = parseCommandLineArgs(args);
    try {
        console.log("generating component")
        // let template = loadTemplate(name);
        // let generatedCopy = template.load(data);
        // writeTemplateToDestination(template);
    } catch (err){
        console.log(err);
        process.exit(1);
    }
})();
