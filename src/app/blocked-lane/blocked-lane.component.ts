import { Component } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardService } from '../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-blocked-lane',
  templateUrl: './blocked-lane.component.html',
  styleUrls: ['./blocked-lane.component.scss'],
})
export class BlockedLaneComponent {
  tickets: Ticket[] = [
    {
      title: 'pick out outfits for the upcoming show',
      ticketNumber: 'MD-624',
      description: '* pack away clothes',
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'blocked',
      index: 0,
    },
  ];
  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
