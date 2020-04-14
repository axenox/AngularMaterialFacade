import { IWidgetInterface } from './widget.interface';

export interface IWidgetContainer extends IWidgetInterface {
    widgets: IWidgetInterface[];
}
