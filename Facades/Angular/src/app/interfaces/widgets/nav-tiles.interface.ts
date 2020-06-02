import { IWidgetWidgetGrid } from './widget-grid.interface';
import { IWidgetTilesInterface } from './tiles.interface';

export interface IWidgetNavTilesInterface extends IWidgetWidgetGrid {
    widgets: IWidgetTilesInterface[];
}
