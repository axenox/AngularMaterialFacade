import { IWidgetInterface } from '../widgets/widget.interface';

export enum WidgetEventType {
    KEYPRESSED,
    CLICKED,
    VALUE_CHANGED,
    DATA_CHANGED,
    ACTION_CALLED,
}

export interface IWidgetEvent {
    source: IWidgetInterface;
    type: WidgetEventType;
    value: any;
}