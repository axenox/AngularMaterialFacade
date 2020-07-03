export enum Actions {
    ACTION_SHOW_WIDGET = 'exface.Core.ShowWidget',
    ACTION_READ_PREFILL = 'exface.Core.ReadPrefill',
    ACTION_UPDATE_DATA = 'exface.Core.UpdateData',
    ACTION_SHOW_OBJECT_EDIT_DIALOG = 'exface.Core.ShowObjectEditDialog'
}

export interface DataRow {}

export interface DataSheet {
  /**
   * the alias of the meta object.
   */
  object_alias: string;

  /**
   * the data that will be passed to the server action.
   */
  rows: DataRow[];
}

export interface DataResponse {
  rows?: DataRow[];
  recordsFiltered?: number;
  recordsTotal?: number;
  recordsLimit?: number;
  recordsOffset?: number;
  footerRows?: number;
  success?: string;
  redirect?: string;
}

export interface Request {
  /**
   * the alias of the action to call.
   */
  action: string;

  /**
   * current page alias.
   */
  resource: string;

  /**
   * the data that will be passed to the server action.
   */
  data?: DataSheet;

  /**
   * the prefill data that will be passed to the server action.
   */
  prefill?: DataSheet;

  /**
   * the alias of the meta object.
   */
  object_alias?: string;
  
  /**
   * ID of the widget.
   */
  element?: string;
}