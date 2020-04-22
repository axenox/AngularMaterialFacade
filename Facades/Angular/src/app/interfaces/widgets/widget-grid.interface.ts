import { IWidgetInterface } from './widget.interface';
import { IWidgetContainer } from './container.interface';
import { IWidgetButton } from './button.interface';

export interface IWidgetWidgetGrid extends IWidgetContainer {
    columns_in_grid: number;
}
