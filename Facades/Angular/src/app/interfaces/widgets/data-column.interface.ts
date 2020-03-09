import { IWidgetInterface } from './widget.inteface';

export interface IWidgetDataColumn extends IWidgetInterface {
    data_column_name: string;
    attribute_alias: string;
    sortable: boolean;
    filterable: boolean;
}