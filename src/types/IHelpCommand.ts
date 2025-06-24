export interface IHelpCommand {
    description: string,
    usage: string,
    options: {
        flags: string,
        description: string,
    }[]
}