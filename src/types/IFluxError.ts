import {IResponse} from "./IResponse";

export interface IFluxError {
    __flux_error_type: string,
    response: IResponse
}