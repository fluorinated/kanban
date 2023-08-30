import { AfterViewChecked, Component, Input } from '@angular/core';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements AfterViewChecked {
  @Input() title: string;
  @Input() pageNumber: string;
  @Input() totalPages: string;
  showTotalPagesCaretBefore: boolean = false;
  showTotalPagesCaretAfter: boolean = false;

  constructor(private swimlaneStore: SwimlaneStore) {}

  ngAfterViewChecked(): void {
    this.showTotalPagesCaretBefore = Number(this.pageNumber) > 1;
    this.showTotalPagesCaretAfter =
      Number(this.pageNumber) < Number(this.totalPages);
  }

  pageBack() {
    this.swimlaneStore.pageBack(this.title);
    this.showTotalPagesCaretBefore = Number(this.pageNumber) > 1;
    this.showTotalPagesCaretAfter =
      Number(this.pageNumber) < Number(this.totalPages);
  }

  pageForward() {
    this.swimlaneStore.pageForward(this.title);
    this.showTotalPagesCaretBefore = Number(this.pageNumber) > 1;
    this.showTotalPagesCaretAfter =
      Number(this.pageNumber) < Number(this.totalPages);
  }
}
