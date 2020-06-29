import { IWidgetInterface } from './widget.interface';
import { IWidgetButton } from './button.interface';
import { IWidgetWidgetGrid } from './widget-grid.interface';

export interface IWidgetPanel extends IWidgetWidgetGrid {
    icon: string;
    icon_class: string;
    icon_set: string;
    show_icon: boolean;
}
