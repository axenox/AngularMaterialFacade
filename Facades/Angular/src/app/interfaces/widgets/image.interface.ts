import { IWidgetDisplayInterface } from './display.interface';

export interface IWidgetImageInterface extends IWidgetDisplayInterface {
    base_url: string;
    base_url_absolute: string;
}