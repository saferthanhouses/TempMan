import {PathLike, exists, mkdir, writeFile} from "fs";
import * as p from  'path'
import {promisify} from "util";
import * as path from "path";

const doesExist = promisify(exists);
const mkDir = promisify(mkdir);
const writeFilePromisified = promisify(writeFile);

export async function writeFileDeep(path : PathLike, file : string){
    let parsedPath = p.parse(path.toString());
    let exists = await doesExist(parsedPath.dir);
    if (!exists){
        await mkDir(parsedPath.dir, { recursive: true });
    }

    await writeFilePromisified(path, file, { encoding: "utf-8" });
}

export function createPathLike(...args : string[]|PathLike[]){
    return path.join.apply(null, args);
}
