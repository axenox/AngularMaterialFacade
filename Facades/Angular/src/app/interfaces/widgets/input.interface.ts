import { IWidgetValueInterface } from './value.interface';
import { IWidgetDataTable } from './data-table.interface';

export interface IWidgetInputInterface extends IWidgetValueInterface {
    required: boolean;
    validation_error_text: string;
}
