import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from '@models/board.model';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent {
  @Input() boards: Board[];

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() caretClicked: EventEmitter<Board> = new EventEmitter<Board>();
  @Output() trashClicked: EventEmitter<Board> = new EventEmitter<Board>();

  onCaretClick(board: Board): void {
    this.caretClicked.emit(board);
  }
  onTrashClick(board: Board): void {
    this.trashClicked.emit(board);
  }
  closeBoardsList(): void {
    this.closeButtonClicked.emit();
  }
}
