import { IWidgetInterface } from './widget.interface';
import { IActionInterface } from '../actions/action.interface';

export interface IWidgetButton extends IWidgetInterface {
    action: IActionInterface;
    icon: string;
}
