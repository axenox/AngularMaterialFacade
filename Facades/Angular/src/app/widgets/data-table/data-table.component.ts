import {
  Component,
  OnInit,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IWidgetDataColumn } from '../../interfaces/widgets/data-column.interface';
import { IWidgetDataTable } from '../../interfaces/widgets/data-table.interface';
import { IWidgetFilter } from '../../interfaces/widgets/filter.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MdePopoverTrigger } from '@material-extended/mde';
import { IWidgetEvent, WidgetEventType } from '../../interfaces/events/widget-event.interface';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import { ActionsService, DataResponse, DataRow } from 'src/app/api/actions.service';
import { FormGroup, FormControl } from '@angular/forms';

export interface IColumnDef {
  columnDef: string;
  header: string;
  cell: (element: any) => string;
}

export interface FilterEntry {
  property: string;
  name: string;
  value: any;

}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input()
  widget: IWidgetDataTable;

  @Input()
  pageSelector: string;

  @Output()
  refresh = new EventEmitter();

  displayedColumns: string[];

  globalSearch: string;

  dataSource: MatTableDataSource<any>;

  filter = { _global_: '' };

  quickSearch: string;

  selection = new SelectionModel<any>(true, []);

  pager: PageEvent = {
    length: null,
    pageIndex: 0,
    pageSize: 40,
    previousPageIndex: null
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filterChips: FilterEntry[] = [];
  dialogRef: any;

  response: DataResponse = { rows: [] };

  rows: DataRow[];

  filterFormGroup = new FormGroup({});

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  constructor(private dialog: MatDialog, private actions: ActionsService) {}

  ngOnInit() {
    this.displayedColumns = ['_checkboxes_'];
    this.displayedColumns.push(...this.widget.columns.map(c => c.data_column_name));
    this.displayedColumns.push('_actions_');
    this.loadData();

    this.sort.sortChange.subscribe((sort: Sort) => {
      this.loadData(this.filterChips);
    });

    // create controls for the filter widgets
    this.widget.filters.forEach((filterWidget: IWidgetFilter) => {
      this.filterFormGroup.addControl(filterWidget.input_widget.attribute_alias, new FormControl(''))
    });
    

  }
  
  
  addChip(property: string, name: string, value: string): void {
    this.removeChipWithName(name);

    if ((value || '').trim()) {
      this.filterChips.push({ property, name, value });
    }
  }

  removeChipWithName(name: string) {
    const chip = this.filterChips.find(
      (c: FilterEntry) => c.name === name
    );
    if (chip) {
      this.removeChip(chip);
    }
  }

  removeChip(chip: FilterEntry): void {
    const index = this.filterChips.indexOf(chip);

    if (index >= 0) {
      this.filterChips.splice(index, 1);
      delete this.filter[chip.property];
      this.dataSource.filter = JSON.stringify(this.filter);
      this.loadData(this.filterChips);
    }
  }

  createDataSource() {
    this.dataSource = new MatTableDataSource(this.rows);
  }

  onWidgetEvent(event: IWidgetEvent) {
    if (event.type === WidgetEventType.VALUE_CHANGED){
      this.filter[(event.source as IWidgetDataColumn).attribute_alias] = event.value;
    }
    if (event.type === WidgetEventType.KEYPRESSED && event.value === 'Enter'){
      this.onRefresh();
    }
  }

  tableFilter() {
    return (row: any, filter: string) => {
      const globalValue = this.filter._global_;

      // Spaltenweise filtern
      let match = true;
      this.filterChips.forEach((chip: FilterEntry) => {
        const rowValue = row[chip.property];
        if (
          !rowValue ||
          rowValue.toLowerCase().indexOf(chip.value.toLowerCase()) === -1
        ) {
          match = false;
        }
      });
      return match;
    };
  }

  loadData(filterEntries?: FilterEntry[]) {
    this.actions.readData(this.pageSelector, this.widget, this.sort.active, this.sort.direction, 
      this.pager.pageIndex * this.pager.pageSize, this.pager.pageSize, this.quickSearch, filterEntries)
      .subscribe((response: DataResponse) => {
        this.response = response;
        this.rows = response.rows;
        if (this.response && this.pager.pageIndex > 0 && this.response.recordsTotal <= this.pager.pageIndex * this.pager.pageSize) {
          this.pager.pageIndex = 0;
          this.loadData(filterEntries);
        }
        else {
          this.createDataSource();
        }
      });
  }

  onPaginate(pageEvent: PageEvent) {
    this.pager = pageEvent;
    this.onRefresh();
  }

  onSearch(){
    this.trigger.togglePopover();
    this.onRefresh();
  }

  onRefresh() {
    this.widget.filters.forEach((col: IWidgetFilter) => {
      const value = this.filter[col.input_widget.data_column_name];
      if (value) {
        this.addChip(col.input_widget.data_column_name, col.caption, value);
      }
    });
    this.loadData(this.filterChips);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows ? this.rows.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.rows.forEach(row => this.selection.select(row));
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
