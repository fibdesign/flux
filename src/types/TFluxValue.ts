import {IFuxRequestNode} from "./TFluxAST";

export interface TFluxValueObject {
    [key: string]: TFluxValue;
}

export type TFluxValue =  string | number | boolean | null | IFuxRequestNode | TFluxValueObject;