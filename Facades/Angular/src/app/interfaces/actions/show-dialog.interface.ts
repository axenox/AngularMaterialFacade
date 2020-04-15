import { IActionInterface } from './action.interface';
import { IWidgetInterface } from '../widgets/widget.interface';

export interface IActionShowDialog extends IActionInterface {
    widget: IWidgetInterface;
    prefill_with_input_data: boolean;
    prefill_with_prefill_data: boolean;
    prefill_with_filter_context: boolean;
}