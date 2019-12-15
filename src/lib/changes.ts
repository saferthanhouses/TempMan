import {Change, ChangeMap} from "./types";
import * as path from "path";
import {TEMPORARY_DIR} from "../config";
import {promisify} from "util";
import {readFile, rename, writeFile} from "fs";
const readFilePromisified = promisify(readFile);
const writeFilePromisified = promisify(writeFile);
const renamePromisified = promisify(rename);


export default function replaceVars(changeMap: ChangeMap, data: {[key: string]: string}){
    // for each change in the changeMap, make change at the location relative to the dest
    return Object.entries(changeMap).map(([changePath, changes])=>
        makeChangesAtPath(changePath, changes, data)
    )
}

async function makeChangesAtPath(changePath: string, changes: Change[], data:{[key: string]: string} ){
    let fPath = path.join(TEMPORARY_DIR, changePath);
    let newPath = fPath;
    let nameChanges : string[] = [];
    let fileChanges : string[] = [];
    changes.forEach((change)=>{
        if (change.isName) nameChanges.push(change.variableName);
        if (!change.isFolder && !change.isName){
            fileChanges.push(change.variableName);
        }
    });

    if (nameChanges.length){
        nameChanges.forEach((varName) => {
            newPath = newPath.replace(`#{${varName}}`, data[varName]);
        });
        await renamePromisified(fPath, newPath)
    }

    if (fileChanges.length){
        let file = await readFilePromisified(newPath, {encoding:  'utf-8'});
        fileChanges.forEach((varName) => {
            file = file.replace(`#{${varName}}`, data[varName])
        });
        await writeFilePromisified(newPath, file, {encoding: 'utf8'});
    }
}

