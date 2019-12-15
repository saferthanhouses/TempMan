import {createPathLike, mkDirDeep, promisifiedNcp} from "../utils/files";

import {TEMPLATE_DIR, TEMPORARY_DIR} from "../config";
import {readdirSync, mkdirSync} from "fs";
import loadTemplate from "./load";
import {Change, DataInput} from "./types";
import {validate} from "./data";
import replaceVars from "./changes";

export default async function generateTemplateInstance(tempName: string, data: DataInput, dest: string){
    const templateLocation = createPathLike(TEMPLATE_DIR, tempName);
    const tempDir= createPathLike(TEMPORARY_DIR, tempName);

    let dirContents = readdirSync(TEMPLATE_DIR);

    if (!~dirContents.indexOf(tempName)) {
        console.log(`Template ${tempName} not found\n`);
    }

    try {
        await mkDirDeep(tempDir);
        // copy template to the temp directory
        await promisifiedNcp(templateLocation, tempDir);
        let [changeMap, varNames] = await loadTemplate(templateLocation);
        const normalizedChangeMap = normalizePaths(TEMPLATE_DIR, changeMap);

        data = validate(data, varNames);
        await replaceVars(normalizedChangeMap, data)

        await promisifiedNcp(tempDir, dest)

    } catch(err){
        console.log("error", err.message);
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
