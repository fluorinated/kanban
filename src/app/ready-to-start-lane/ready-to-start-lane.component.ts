import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

import { Ticket } from '../models/ticket.model';
import { BoardService } from '../board/board.service';

@Component({
  selector: 'app-ready-to-start-lane',
  templateUrl: './ready-to-start-lane.component.html',
  styleUrls: ['./ready-to-start-lane.component.scss'],
})
export class ReadyToStartLaneComponent {
  @Input() tickets: Ticket[];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
