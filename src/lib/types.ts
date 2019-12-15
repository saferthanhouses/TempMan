import {PathLike} from "fs";


export type VarMatch = {
    varName: string;
    position?: number;
}

export type VariableMatch = [string, number];

export type VarMap = {
    [key: string]: [VarMatch]
}

export interface Change {
    path: PathLike;
    variableName: string;
    position: number;
    isName: boolean;
    isFolder: boolean;
}

export type DataInput = {[key: string]: string}  | string;

export type ChangeMap = {[key: string]: Change[]}
