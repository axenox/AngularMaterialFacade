import { IWidgetInterface } from './widget.inteface';

export interface IDataPaginatorInterface extends IWidgetInterface {
    page_size: string;
    page_sizes: [];
}