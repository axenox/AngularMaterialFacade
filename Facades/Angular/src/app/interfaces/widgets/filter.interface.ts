import { IWidgetInterface } from './widget.inteface';
import { IWidgetInputInterface } from './input.interface';

export interface IWidgetFilter extends IWidgetInterface {
    input_widget: IWidgetInputInterface;
}