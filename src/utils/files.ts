import {
    PathLike,
    exists,
    mkdir,
    writeFile,
    createReadStream,
    createWriteStream,
    rmdir,
    readdir,
    lstat,
    unlink
} from "fs";
import * as p from  'path'
import {promisify} from "util";
import * as path from "path";
import ncp from "ncp";

const doesExist = promisify(exists);
const mkDir = promisify(mkdir);
const readDir = promisify(readdir)
const writeFilePromisified = promisify(writeFile);
const rmDirPromisified = promisify(rmdir);
const lStat = promisify(lstat);
const unLink = promisify(unlink);

export async function mkDirDeep(path: PathLike){
    let parsedPath = p.parse(path.toString());
    let exists = await doesExist(parsedPath.dir);
    if (!exists){
        await mkDir(parsedPath.dir, { recursive: true });
    }
}

export async function rmDirDeep(path: PathLike){
    let exists = await doesExist(path);
    if( exists ) {
        let contents = await readDir(path);
        await Promise.all(contents.map(async (file,index) =>{
            let curPath = p.join(path.toString(), file);
            let isDir = (await lStat(curPath)).isDirectory();
            if(isDir) { // recurse
                await rmDirDeep(curPath);
            } else { // delete file
                await unLink(curPath);
            }
        }));
        await rmDirPromisified(path)
    }
}

export async function writeFileDeep(path : PathLike, file : string){
    await mkDirDeep(path)
    await writeFilePromisified(path, file, { encoding: "utf-8" });
}

export function createPathLike(...args : string[]|PathLike[]): string{
    return path.join.apply(null, args);
}

export function promisifiedCopyFileStream(filePath: string, dest: string){
    return new Promise((resolve, reject)  => {
        let rs = createReadStream(filePath);
        let ws = createWriteStream(dest);
        rs.pipe(ws);
        ws.on('finish', ()=>{
            resolve()
        })
        ws.on('error', (err) => reject(err))
        rs.on('error', (err) => reject(err))
    })
}

export function promisifiedNcp(source: string, dest: string){
    return new Promise((resolve, reject) =>  {
        ncp(source, dest, {stopOnErr: true}, (err)=>{
            if (err) {
                console.log({err});
                reject(err)
            }
            resolve();
        })
    })
}

