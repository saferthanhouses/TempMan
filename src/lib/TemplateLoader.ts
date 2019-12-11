import {lstat, PathLike, readdir, readdirSync, readFile, writeFile} from 'fs'
import {promisify} from "util";
import {createPathLike} from "../utils/files";
import {findVariablesIn} from "../utils/strings";
import EventPromise from './EventPromise';

const readDirPromisified = promisify(readdir);
const lStatPromisified = promisify(lstat);
const readFilePromisified = promisify(readFile);

const templateLocation = "templates";

interface Change {
    path: PathLike;
    variableName: string;
    position: number;
    isMeta: boolean;
}

export class TemplateLoader extends EventPromise {
    public static readonly LOADED = "LOADED";
    public static readonly FAILURE = "FAILURE";

    private changeQueue: Change[] = [];
    private templateLocation: PathLike;

    constructor(templateName: string) {
        super();
        this.loadTemplate(templateName)
    }

    async loadTemplate(templateName: string) {
        this.templateLocation = createPathLike(templateLocation, templateName);
        let dirContents = readdirSync(this.templateLocation);
        if (~dirContents.indexOf(templateName)) {
            this.clean();
            console.log(`Template ${templateName} not found\n`);
        }

        await this.loadDir(this.templateLocation)

        this.emit(TemplateLoader.LOADED, this.getChangeTree())
    }

    private async loadDir(path: PathLike) {
        let contents = await readDirPromisified(path);
        await Promise.all(contents.map((member) => this.checkDirMember(member, path.toString())));
    }

    private async checkDirMember(fileOrFolderName: string, path: string) {
        let targetPath = createPathLike(path, fileOrFolderName);
        let stats = await lStatPromisified(targetPath);

        let [match] = findVariablesIn(fileOrFolderName);
        if (match !== undefined) {
            this.addToChanges(targetPath, match[0], match[1], true);
        }

        if (stats.isDirectory()) {
            let subVars = await this.loadDir(targetPath);
        } else {
            await this.checkFile(targetPath)
        }
    }

    private async checkFile(targetPath: PathLike) {
        let file = await readFilePromisified(targetPath, "utf-8");
        let matches = findVariablesIn(file);
        matches.forEach(([varName, position]) => {
             this.addToChanges(targetPath.toString(), varName, position)
        })
    }

    private addToChanges(path: string, variableName: string, position: number, isMeta=  false) {
        let relativePath = path.replace(this.templateLocation.toString(), '');

        this.changeQueue.push({path: relativePath, variableName, position, isMeta});
    }

    private getChangeTree(){
        return this.changeQueue.reduce((accum, next) => {
            if (accum[next.path.toString()] === undefined){
                accum[next.path.toString()] = [next]
            }  else {
                accum[next.path.toString()].push(next)
            }
            return accum;
        }, {} as {[key: string]: Change[]})
    }

    clean() {
        this.templateLocation = "";
        this.changeQueue = [];
    }


    // async generate(data: string | { [p: string]: string }) {
    //     let dataProcessed: { [key: string]: string } = {};
    //     if (typeof data === 'string' && this.getVariableNames().size === 1) {
    //         let singleVar = Array.from(this.getVariableNames())[0];
    //         dataProcessed[singleVar] = data;
    //     } else {
    //         dataProcessed = data as { [key: string]: string };
    //     }
    //
    //     let allDataReceived =
    //         Object.keys(dataProcessed).every(dataKey => this.getVariableNames().has(dataKey));
    //
    //     if (!allDataReceived) {
    //         throw new Error("Did not receive all data values for the template")
    //     }
    //
    //     let diffMap = Object.entries(dataProcessed).reduce((accum, [key, val]) => {
    //         accum[key] = key.length - val.length;
    //         return accum;
    //     }, {} as { [key: string]: number });
    //
    //     await Promise.all(Object.entries(this.vars).map(async ([path, vars]) => {
    //         console.log("path", path, "vars", vars);
    //         let file = await readFilePromisified(path, {encoding: 'utf-8'});
    //         let diff = 0;
    //         vars.forEach(varz => {
    //             let pos = varz.position - diff;
    //             file = file.slice(0, pos) + dataProcessed[varz.varName] + file.slice(pos + varz.varName.length);
    //             diff += diffMap[varz.varName]
    //         });
    //         await writeFileDeep(path.replace('templates', 'tmp'), file)
    //     }))
    // }
}
