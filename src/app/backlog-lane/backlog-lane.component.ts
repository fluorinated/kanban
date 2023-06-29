import { BoardService } from './../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-backlog-lane',
  templateUrl: './backlog-lane.component.html',
  styleUrls: ['./backlog-lane.component.scss'],
})
export class BacklogLaneComponent {
  @Input() tickets: Ticket[];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
