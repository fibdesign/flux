import {TVoidFunction} from "./TVoidFunction";

export interface TCommandEntry {
    name?: string,
    aliases: string[],
    handler: TVoidFunction,
    description?: string,
}