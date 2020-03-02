import { IWidgetInterface } from './widget.inteface';
import { IWidgetSorter } from './sorter.interface';
import { IWidgetFilter } from './filter.interface';
import { IWidgetDataColumn } from './data-column.interface';

export interface IWidgetDataTable extends IWidgetInterface {
    filters: IWidgetFilter[];
    columns: IWidgetDataColumn[];
    sorters: IWidgetSorter[];
}