

export type VarMatch = {
    varName: string;
    position?: number;
}

export type VariableMatch = [string, number];

export type VarMap = {
    [key: string]: [VarMatch]
}
