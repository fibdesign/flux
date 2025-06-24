import {IToken} from "./IToken";
import {TFluxValue} from "./TFluxValue";

export interface IFluxVariable {
    type: IToken,
    value: TFluxValue,
    isConstant: boolean,
    nullable: boolean,
};