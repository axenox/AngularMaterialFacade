export interface IActionInterface {
    alias: string;
    object_alias: string;
    input_rows_min: number;
    input_rows_max: number;
    fallback_actions: string[];
}