import { IDataTypeInterface } from './data-type.interface';

export interface ITimeDataTypeInterface extends IDataTypeInterface {
    format: string;
    format_to_parse_to: string;
    show_seconds: boolean;
    am_pm: boolean;
}