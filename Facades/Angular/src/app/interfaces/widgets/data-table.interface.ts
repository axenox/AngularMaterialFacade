import { IWidgetInterface } from './widget.inteface';
import { IWidgetSorter } from './sorter.interface';
import { IWidgetFilter } from './filter.interface';
import { IWidgetDataColumn } from './data-column.interface';
import { IActionInterface } from 'src/app/interfaces/actions/action.interface';
import { IDataPaginatorInterface } from './data-paginator.interface';
import { IWidgetButton } from './button.interface';

export interface IWidgetDataTable extends IWidgetInterface {
    filters: IWidgetFilter[];
    columns: IWidgetDataColumn[];
    sorters: IWidgetSorter[];
    buttons: IWidgetButton[];
    lazy_loading_action: IActionInterface;
    paginator: IDataPaginatorInterface;
    multi_select: boolean;
}