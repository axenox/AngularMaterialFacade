import { IWidgetInterface } from './widget.inteface';
import { IActionInterface } from '../actions/action.interface';

export interface IWidgetButton extends IWidgetInterface {
    action: IActionInterface;
}
