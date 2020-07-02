import { IWidgetInterface } from './widget.interface';
import { IWidgetTabs } from './tabs.interface';
import { IWidgetContainer } from './container.interface';

export interface IWidgetLoginPrompt extends IWidgetTabs {
    message_list: IWidgetContainer;
}