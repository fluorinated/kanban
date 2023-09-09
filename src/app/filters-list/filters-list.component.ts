import { Component, EventEmitter, Output } from '@angular/core';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss'],
})
export class FiltersListComponent {
  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter<void>();

  currentBoardTags$: Observable<string[]>;
  currentBoardActiveTags$: Observable<string[]>;

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {
    this.currentBoardTags$ = this.boardStore.currentBoardTags$;
    this.currentBoardActiveTags$ = this.boardStore.currentBoardActiveTags$;
  }

  closeFiltersList(): void {
    this.closeButtonClicked.emit();
  }

  removeTag(tag: string): void {
    this.swimlaneStore.removeTagFromCurrentBoardActiveTagsUpdatePagination(tag);
  }

  tagClicked(tag: string): void {
    this.swimlaneStore.addTagToCurrentBoardActiveTagsUpdatePagination(tag);
  }
}
