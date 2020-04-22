import { IWidgetInterface } from './widget.interface';
import { IWidgetButton } from './button.interface';
import { IWidgetPanel } from './panel.interface';

export interface IWidgetForm extends IWidgetPanel {
    buttons: IWidgetButton[];
    uid_data_column_name: string;
}
