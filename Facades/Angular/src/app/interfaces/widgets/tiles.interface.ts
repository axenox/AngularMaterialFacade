import { IWidgetWidgetGrid } from './widget-grid.interface';
import { IWidgetTileInterface } from './tile.interface';

export interface IWidgetTilesInterface extends IWidgetWidgetGrid {
    widgets: IWidgetTileInterface[];
}
