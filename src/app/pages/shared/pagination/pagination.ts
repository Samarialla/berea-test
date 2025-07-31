import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss'
})
export class Pagination {
  @Input() offset: number = 0;
  @Input() limit: number = 10;
  @Input() total: number = 50;
  @Input() currentLength: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  prevPage() {
    if (this.offset > 0) {
      this.pageChange.emit(this.offset - this.limit);
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.total) {
      this.pageChange.emit(this.offset + this.limit);
    }
  }
}
