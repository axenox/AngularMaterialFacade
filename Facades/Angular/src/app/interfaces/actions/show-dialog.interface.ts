import { IActionInterface } from './action.interface';
import { IWidgetInterface } from '../widgets/widget.interface';

export interface IActionShowDialog extends IActionInterface {
    widget: IWidgetInterface;
}