import { Component, Input } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardService } from '../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-blocked-lane',
  templateUrl: './blocked-lane.component.html',
  styleUrls: ['./blocked-lane.component.scss'],
})
export class BlockedLaneComponent {
  @Input() tickets: Ticket[];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
