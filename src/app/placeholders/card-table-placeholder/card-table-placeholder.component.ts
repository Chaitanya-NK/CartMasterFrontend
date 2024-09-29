import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-card-table-placeholder',
    templateUrl: './card-table-placeholder.component.html',
    styleUrls: ['./card-table-placeholder.component.css']
})
export class CardTablePlaceholderComponent {
    @Input() columnCount: number = 5
    @Input() rowCount: number = 3
}
