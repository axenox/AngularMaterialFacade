import { IWidgetInputSelectInterface } from './input-select.interface';
import { IWidgetDataTable } from './data-table.interface';

export interface IWidgetInputComboTable extends IWidgetInputSelectInterface {
    table: IWidgetDataTable;
}
