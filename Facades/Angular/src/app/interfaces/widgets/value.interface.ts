import { IWidgetInterface } from './widget.interface';

export interface IWidgetValueInterface extends IWidgetInterface {
    attribute_alias: string;
    data_column_name: string;
}