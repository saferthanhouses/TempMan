import {Change} from "./Loader";

export default class Generator {
    async  generate(changeMap: { [key: string]: Change[] }) {
        // let dataProcessed: { [key: string]: string } = {};
        //
        // let allDataReceived =
        //     Object.keys(dataProcessed).every(dataKey => this.getVariableNames().has(dataKey));
        //
        // if (!allDataReceived) {
        //     throw new Error("Did not receive all data values for the template")
        // }
        //
        // let diffMap = Object.entries(dataProcessed).reduce((accum, [key, val]) => {
        //     accum[key] = key.length - val.length;
        //     return accum;
        // }, {} as { [key: string]: number });
        //
        // await Promise.all(Object.entries(this.vars).map(async ([path, vars]) => {
        //     console.log("path", path, "vars", vars);
        //     let file = await readFilePromisified(path, {encoding: 'utf-8'});
        //     let diff = 0;
        //     vars.forEach(varz => {
        //         let pos = varz.position - diff;
        //         file = file.slice(0, pos) + dataProcessed[varz.varName] + file.slice(pos + varz.varName.length);
        //         diff += diffMap[varz.varName]
        //     });
        //     await writeFileDeep(path.replace('templates', 'tmp'), file)
        // }))
    }
}
