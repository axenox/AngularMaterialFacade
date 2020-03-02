import { IWidgetInputInterface } from 'src/app/data-table/data-table-structure.interface';

export interface IWidgetInputSelectInterface extends IWidgetInputInterface {
    selectable_options: {}
    multi_select: boolean;
    text_attribute_alias: string;
    value_attribute_alias: string;
}