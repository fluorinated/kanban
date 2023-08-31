import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardStore } from '../board/store/board-store.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() placeholder: string;

  searchTerm$: Observable<string>;

  constructor(private boardStore: BoardStore) {
    this.searchTerm$ = this.boardStore.searchTerm$;
  }

  onKeyUp($event): void {
    this.boardStore.setSearchTerm($event?.target?.value);
  }
}
