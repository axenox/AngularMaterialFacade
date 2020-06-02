import { IWidgetButton } from './button.interface';
import { IWidgetInterface } from './widget.interface';

export interface IWidgetTileInterface extends IWidgetButton {
    title: string;
    subtitle: string;
}
