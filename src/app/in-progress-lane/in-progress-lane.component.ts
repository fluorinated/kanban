import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { BoardService } from '../board/board.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-in-progress-lane',
  templateUrl: './in-progress-lane.component.html',
  styleUrls: ['./in-progress-lane.component.scss'],
})
export class InProgressLaneComponent {
  tickets: Ticket[] = [
    {
      title: 'mop the entire house',
      ticketNumber: 'MD-621',
      description: '* fill bucket with hot water and go to town',
      tags: ['buy', 'chore', 'home-improvement'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'in progress',
      index: 0,
    },
  ];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
