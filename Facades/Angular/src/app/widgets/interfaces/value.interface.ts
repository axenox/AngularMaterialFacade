import { IWidgetInterface } from './widget.inteface';

export interface IWidgetValueInterface extends IWidgetInterface {
    attribute_alias: string;
    data_column_name: string;
}