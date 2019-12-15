import {VariableMatch} from "../lib/types";

const variableRegexp = /(\#\{(\w+)\})/gi;

export function findVariablesIn(str: string) : VariableMatch[] {
    let match;
    let matches : VariableMatch[] = [];
    do {
        match = variableRegexp.exec(str);
        if (match && match.length){
            console.log(`Found variable ${match[1]} at position ${variableRegexp.lastIndex}.`);
            let varMatch : VariableMatch = [match[2], variableRegexp.lastIndex];
            matches.push(varMatch);
        }
    } while (match);
    return matches;
}
