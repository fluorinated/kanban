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
  // @Input() tickets: Ticket[];
  tickets: Ticket[] = [
    {
      title: 'pack clothes for travel to indianapolis',
      ticketNumber: 'MD-622',
      description: '* pack away clothes',
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'rdy 2 start',
      index: 0,
    },
    {
      title: 'pick out outfits for the upcoming show',
      ticketNumber: 'MD-624',
      description: '* pack away clothes',
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'rdy 2 start',
      index: 1,
    },
  ];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
