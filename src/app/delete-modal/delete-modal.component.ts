import { Component } from '@angular/core';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent {
  isDeleteModalOpen$: Observable<boolean>;

  constructor(private boardStore: BoardStore) {
    this.isDeleteModalOpen$ = this.boardStore.isDeleteModalOpen$;
  }
  closeModal() {
    this.boardStore.setIsDeleteModalOpen(false);
  }

  checkClicked() {
    this.boardStore.determineDeleteItem();
  }

  xClicked() {
    this.boardStore.setIsDeleteModalOpen(false);
  }
}
