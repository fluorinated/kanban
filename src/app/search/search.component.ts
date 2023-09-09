import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardStore } from '../board/store/board-store.service';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() placeholder: string;

  searchTerm$: Observable<string>;

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {
    this.searchTerm$ = this.boardStore.searchTerm$;
  }

  onKeyUp($event): void {
    this.swimlaneStore.setSearchTermUpdatePagination($event?.target?.value);
  }
}
