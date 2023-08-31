import { Component, EventEmitter, Output } from '@angular/core';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent {
  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  currentBoardTags$: Observable<string[]>;
  currentBoardActiveTags$: Observable<string[]>;

  constructor(private boardStore: BoardStore) {
    this.currentBoardTags$ = this.boardStore.currentBoardTags$;
    this.currentBoardActiveTags$ = this.boardStore.currentBoardActiveTags$;
  }

  closeFiltersList(): void {
    this.closeButtonClicked.emit();
  }

  removeTag(tag: string): void {
    this.boardStore.removeTagFromCurrentBoardActiveTags(tag);
  }

  tagClicked(tag: string): void {
    this.boardStore.addTagToCurrentBoardActiveTags(tag);
  }
}
