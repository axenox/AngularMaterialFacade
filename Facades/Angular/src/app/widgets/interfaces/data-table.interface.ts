import { IWidgetInterface } from './widget.inteface';
import { IWidgetSorter } from './sorter.interface';
import { IWidgetFilter } from './filter.interface';
import { IWidgetDataColumn } from './data-column.interface';
import { IActionInterface } from 'src/app/interfaces/actions/action.interface';

export interface IWidgetDataTable extends IWidgetInterface {
    filters: IWidgetFilter[];
    columns: IWidgetDataColumn[];
    sorters: IWidgetSorter[];
    lazy_loading_action: IActionInterface
}