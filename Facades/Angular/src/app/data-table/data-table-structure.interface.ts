export interface IFilter {
    attribute_alias: string;
    caption: string;
}

export interface IColumn {
    attribute_alias: string;
    caption: string;
    sortable?: boolean;
}

export interface ISorter{
    attribute_alias: string;
    direction: string;
}

export interface IDataTableStructure {
    widget_type: string;
    object_alias: string;
    filters: IFilter[];
    columns: IColumn[];
    sorters: ISorter[];
}