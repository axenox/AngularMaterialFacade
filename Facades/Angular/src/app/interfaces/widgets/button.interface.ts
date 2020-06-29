import { IWidgetInterface } from './widget.interface';
import { IActionInterface } from '../actions/action.interface';

export interface IWidgetButton extends IWidgetInterface {
    action: IActionInterface;
    icon: string;
    icon_class: string;
    icon_set: string;
    show_icon: boolean;
}
