import { IWidgetInterface } from './widget.interface';
import { IWidgetInputInterface } from './input.interface';

export interface IWidgetFilter extends IWidgetInterface {
    input_widget: IWidgetInputInterface;
}