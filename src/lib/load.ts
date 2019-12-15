import {lstat, PathLike, readdir, readFile} from 'fs'
import {promisify} from "util";
import {createPathLike} from "../utils/files";
import {findVariablesIn} from "../utils/strings";
import {Change} from "./types";

const readDirPromisified = promisify(readdir);
const lStatPromisified = promisify(lstat);
const readFilePromisified = promisify(readFile);

let varNames = new Set<string>();
let changes: Change[] = [];

export default async function loadTemplate(templateLocation: string) : Promise<[{[key: string]: Change[]}, string[]]> {
    let contents = await readDirPromisified(templateLocation);
    await Promise.all(contents.map((member) => checkDirMember(member, templateLocation)));
    return [getChangeMap(), Array.from(varNames)]
}

async function checkDirMember(fileOrFolderName: string, path: string) {
    let targetPath = createPathLike(path, fileOrFolderName);
    let stats = await lStatPromisified(targetPath);

    let [match] = findVariablesIn(fileOrFolderName);
    if (match !== undefined) {
        addToChanges(targetPath, match[0], match[1], true);
    }

    if (stats.isDirectory()) {
        let subVars = await this.loadDir(targetPath);
    } else {
        await this.checkFile(targetPath)
    }
}

async function checkFile(targetPath: PathLike) {
    let file = await readFilePromisified(targetPath, "utf-8");
    let matches = findVariablesIn(file);
    matches.forEach(([varName, position]) => {
        this.addToChanges(targetPath.toString(), varName, position)
    })
}

function addToChanges(path: string, variableName: string, position: number, isName=  false, isFolder =  false) {
    varNames.add(variableName);
    let relativePath = path.replace(this.templateLocation.toString(), '');

    changes.push({path: relativePath, variableName, position, isName, isFolder});
}

function getChangeMap() : {[key: string]: Change[]} {
    return changes.reduce((accum, next) => {
        if (accum[next.path.toString()] === undefined){
            accum[next.path.toString()] = [next]
        }  else {
            accum[next.path.toString()].push(next)
        }
        return accum;
    }, {} as {[key: string]: Change[]})
}
