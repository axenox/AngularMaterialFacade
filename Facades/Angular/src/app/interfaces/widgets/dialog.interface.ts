import { IWidgetInterface } from './widget.interface';
import { IWidgetContainer } from './container.interface';
import { IWidgetButton } from './button.interface';

export interface IWidgetDialog extends IWidgetContainer {
    buttons: IWidgetButton[]
    icon: string
}
