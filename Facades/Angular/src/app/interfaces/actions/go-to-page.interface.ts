import { IActionInterface } from './action.interface';

export interface IActionGoToPage extends IActionInterface {
    page_alias: string;
}