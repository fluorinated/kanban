import { Component } from '@angular/core';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  isDeleteModalOpen$: Observable<boolean>;

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {
    this.isDeleteModalOpen$ = this.boardStore.isDeleteModalOpen$;
  }
  closeModal(): void {
    this.boardStore.setIsDeleteModalOpen(false);
  }

  checkClicked(): void {
    this.swimlaneStore.determineDeleteCurrentBoardUpdatePagination();
  }

  xClicked(): void {
    this.boardStore.setIsDeleteModalOpen(false);
  }
}
