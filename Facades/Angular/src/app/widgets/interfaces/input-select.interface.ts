import { IWidgetInputInterface } from './input.interface';


export interface IWidgetInputSelectInterface extends IWidgetInputInterface {
    selectable_options: {}
    multi_select: boolean;
    text_attribute_alias: string;
    value_attribute_alias: string;
}