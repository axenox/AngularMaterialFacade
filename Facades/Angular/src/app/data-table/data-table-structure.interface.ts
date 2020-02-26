export interface IWidgetFilter {
    caption: string;
    input_widget: {
        data_column_name: string;
        selectable_options: {};
    }
    //hint: string;
}

export interface IWidgetDataColumn {
    data_column_name: string;
    caption: string;
    //hint: string;
}

export interface ISorter{
    data_column_name: string;
    direction: string;
}

export interface IWidgetDataTable {
    widget_type: string;
    filters: IWidgetFilter[];
    columns: IWidgetDataColumn[];
    sorters: ISorter[];
}