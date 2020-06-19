import { IServerError } from '../server-error.interface';

export interface IWidgetInterface {
    id: string;
    object_alias: string;
    page_alias: string;
    widget_type: string;
    hint: string;
    caption: string;
    visibility: number;
    fallback_widgets: string[];
}
