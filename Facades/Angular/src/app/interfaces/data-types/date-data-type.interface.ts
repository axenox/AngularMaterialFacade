import { IDataTypeInterface } from './data-type.interface';

export interface IDateTimeDataTypeInterface extends IDataTypeInterface {
    format: string;
    format_to_parse_to: string;
}