import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from '@models/board.model';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent {
  @Input() boards: Board[];

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();
  @Output() caretClicked: EventEmitter<Board> = new EventEmitter();
  @Output() trashClicked: EventEmitter<Board> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onCaretClick(board: Board) {
    this.caretClicked.emit(board);
  }
  onTrashClick(board: Board) {
    this.trashClicked.emit(board);
  }
  closeBoardsList() {
    this.closeButtonClicked.emit();
  }
}
