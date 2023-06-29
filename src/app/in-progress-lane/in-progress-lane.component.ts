import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { BoardService } from '../board/board.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-in-progress-lane',
  templateUrl: './in-progress-lane.component.html',
  styleUrls: ['./in-progress-lane.component.scss'],
})
export class InProgressLaneComponent {
  @Input() tickets: Ticket[];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
