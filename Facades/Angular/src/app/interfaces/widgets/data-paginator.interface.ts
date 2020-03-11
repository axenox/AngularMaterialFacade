import { IWidgetInterface } from './widget.interface';

export interface IDataPaginatorInterface extends IWidgetInterface {
    page_size: number;
    page_sizes: [];
}