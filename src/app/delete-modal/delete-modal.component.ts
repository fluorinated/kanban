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
  closeModal(): void {
    this.boardStore.setIsDeleteModalOpen(false);
  }

  checkClicked(): void {
    this.boardStore.determineDeleteItem();
  }

  xClicked(): void {
    this.boardStore.setIsDeleteModalOpen(false);
  }
}
