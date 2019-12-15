export function zipDataFlagsToValues(args: string[]) : {[key: string]: string} {
    let data : {[key: string]: string} = {};
    for (let i = 0; i < args.length ; i+=2){
        let key = args[i];
        let val = args[i+1];
        if (!key.startsWith("--") || val.startsWith("--")){
            showManPage();
            throw new Error("Data passed incorrect format")
        }
        data[key.substr(2)] = val
    }
    return data;
}

function showManPage() {
    console.log(`
        npx generate component ComponentName ./src # template name and single argument
        npx generate component --componentName ComponentName ./src
    `)
}

function showDevError(err: Error){
    if (process.env.NODE_ENV === 'dev'){
        console.log("err", err)
    }
}

export function parseCommandLineArgs(args: string[]){
    try {
        if (args.length < 3) throw new Error("Too few arguments supplied");

        let templateName = args.shift();
        let destinationStr = args.pop();


        let data = args.length === 1 ?
            args[0] :
            zipDataFlagsToValues(args);

        return {
            name: templateName,
            dest: destinationStr,
            data
        }
    } catch (err){
        showDevError(err);
        showManPage();
        // process.exit(1);
    }
}
