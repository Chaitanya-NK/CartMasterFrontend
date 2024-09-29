import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-placeholder',
  templateUrl: './table-placeholder.component.html',
  styleUrls: ['./table-placeholder.component.css']
})
export class TablePlaceholderComponent {
    @Input() columnCount: number = 5
    @Input() rowCount: number = 5

    // getColumns() {
    //     return Array(this.columnCount)
    // }

    // getRows() {
    //     return Array(this.rowCount)
    // }
}
