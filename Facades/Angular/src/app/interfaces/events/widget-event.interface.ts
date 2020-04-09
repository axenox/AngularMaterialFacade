import { IWidgetInterface } from '../widgets/widget.interface';

export enum WidgetEventType {
    KEYPRESSED,
    VALUE_CHANGED,
    DATA_CHANGED
}

export interface IWidgetEvent {
    source: IWidgetInterface;
    type: WidgetEventType;
    value: any;
}