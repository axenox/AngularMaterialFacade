import { IWidgetInterface } from './widget.interface';
import { IWidgetValueInterface } from './value.interface';
import { IWidgetDisplayInterface } from './display.interface';
import { IWidgetTextInterface } from './text.interface';

export interface IWidgetMessageInterface extends IWidgetTextInterface {
    type: string;
}