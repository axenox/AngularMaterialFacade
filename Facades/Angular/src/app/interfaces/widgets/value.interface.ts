import { IWidgetInterface } from './widget.interface';
import { IDataTypeInterface } from '../data-types/data-type.interface';

export interface IWidgetValueInterface extends IWidgetInterface {
    attribute_alias: string;
    data_column_name: string;
    value: string;
    value_data_type: IDataTypeInterface;
}