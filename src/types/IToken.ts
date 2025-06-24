export interface IToken {
    type: string,
    value: string,
    meta?: ITokenMeta
}
export interface ITokenMeta {
    line?: number,
    column?: number,
    codeLine?: string
}