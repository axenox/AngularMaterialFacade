export interface IPageTreeNodeInterface {
    page_alias: string;
    url: string;
    name: string;
    children: IPageTreeNodeInterface[];
    level?: number;
}
