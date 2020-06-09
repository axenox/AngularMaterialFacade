import { IWidgetInterface } from './widgets/widget.interface';

export interface IContextBar {
    visibility: string;
    icon: string;
    color: string;
    hint: string;
    indicator: string;
    bar_widget_id: string;

}

export interface IShell {
    theme: string;
    top_bar: {
        caption: string;
    };
    context_bar: { [key: string]: IContextBar};
    navigation_drawer: IContainerInterface;
}