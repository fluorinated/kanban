import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Board } from '../models/board.model';

@Component({
  selector: 'app-boards-list',
  templateUrl: './boards-list.component.html',
  styleUrls: ['./boards-list.component.scss'],
})
export class BoardsListComponent {
  @Input() boards: Board[];

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();
  @Output() boardClicked: EventEmitter<Board> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  caretClicked(board: Board) {
    this.boardClicked.emit(board);
  }
  closeBoardsList() {
    this.closeButtonClicked.emit();
  }
}
