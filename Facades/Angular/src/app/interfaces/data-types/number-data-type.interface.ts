import { IDataTypeInterface } from './data-type.interface';

export interface INumberDataTypeInterface extends IDataTypeInterface {
    decimal_separator: string;
    base: number;
    min: number;
    max: number;
    precision_min: number;
    precision_max: number;
    group_digits: boolean;
    group_length: number;
}