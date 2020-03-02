export interface IWidgetInterface {
    widget_type: string;
    hint: string;
    caption: string;
}

export interface IWidgetValueInterface extends IWidgetInterface {
    attribute_alias: string;
    data_column_name: string;
}

export interface IWidgetInputInterface extends IWidgetValueInterface {
}

export interface IWidgetInputSelectInterface extends IWidgetInputInterface {
    selectable_options: {}
    multi_select: boolean;
    text_attribute_alias: string;
    value_attribute_alias: string;
}

export interface IWidgetFilter extends IWidgetInterface {
    input_widget: IWidgetInputInterface;
}

export interface IWidgetDataColumn extends IWidgetInterface {
    data_column_name: string;
    attribute_alias: string;
    sortable: boolean;
    filterable: boolean;
}

export interface IWidgetSorter {
    attribute_alias: string;
    direction: string;
}

export interface IWidgetDataTable extends IWidgetInterface {
    filters: IWidgetFilter[];
    columns: IWidgetDataColumn[];
    sorters: IWidgetSorter[];
}