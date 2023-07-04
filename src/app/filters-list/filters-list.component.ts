import { Component, EventEmitter, Output } from '@angular/core';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent {
  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();

  currentBoardTags$: Observable<string[]>;
  currentBoardActiveTags$: Observable<string[]>;

  constructor(private boardStore: BoardStore) {
    this.currentBoardTags$ = this.boardStore.currentBoardTags$;
    this.currentBoardActiveTags$ = this.boardStore.currentBoardActiveTags$;
  }

  ngOnInit(): void {}

  closeFiltersList() {
    this.closeButtonClicked.emit();
  }

  removeTag(tag: string) {
    this.boardStore.removeTagFromCurrentBoardActiveTags(tag);
  }

  tagClicked(tag: string) {
    this.boardStore.addTagToCurrentBoardActiveTags(tag);
  }
}
