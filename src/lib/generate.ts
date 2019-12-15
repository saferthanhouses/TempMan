import {createPathLike, promisifiedNcp} from "../utils/files";

import {TEMPLATE_DIR, TEMPORARY_DIR} from "../config";
import {readdirSync} from "fs";
import loadTemplate from "./load";
import {Change, DataInput} from "./types";
import {validate} from "./data";
import replaceVars from "./changes";

export default async function generateTemplateInstance(tempName:  string, data: DataInput, dest: string){
    let templateLocation = createPathLike(TEMPLATE_DIR, tempName);

    let dirContents = readdirSync(TEMPLATE_DIR);
    if (~dirContents.indexOf(tempName)) {
        console.log(`Template ${tempName} not found\n`);
    }

    try {
        // copy template to the temp directory
        await promisifiedNcp(templateLocation, TEMPORARY_DIR);

        let [changeMap, varNames] = await loadTemplate(templateLocation);

        const normalizedChangeMap = normalizePaths(templateLocation, changeMap);

        data = validate(data, varNames);

        console.log({data})
        await replaceVars(normalizedChangeMap, data)

    } catch(err){
        console.log(err.message);
        process.exit(0)
    }
}

function normalizePaths(rootPath: string, changeMap: {[key: string]: Change[]}): {[key: string]: Change[]} {
    return Object.keys(changeMap).reduce((accum, next)=>{
        let normalizedPath = next.replace(rootPath, '');
        accum[normalizedPath] = changeMap[next];
        return accum;
    }, {} as {[key: string]: Change[]})
}
