import { IWidgetInterface } from './widget.interface';
import { IPageTreeNodeInterface } from '../page-tree-node.interface';

export interface IWidgetNavMenuInterface extends IWidgetInterface {
    nav_menu: IPageTreeNodeInterface[]
}
