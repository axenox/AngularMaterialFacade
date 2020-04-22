import { IWidgetInputSelectInterface } from './input-select.interface';
import { IWidgetDataTable } from './data-table.interface';

export interface IWidgetInputComboTable extends IWidgetInputSelectInterface {
    table: IWidgetDataTable;
    text_attribute_alias: string;
    value_attribute_alias: string;
}
