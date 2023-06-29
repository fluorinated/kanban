import { BoardService } from './../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-backlog-lane',
  templateUrl: './backlog-lane.component.html',
  styleUrls: ['./backlog-lane.component.scss'],
})
export class BacklogLaneComponent {
  // @Input() tickets: Ticket[];
  tickets: Ticket[] = [
    {
      title: 'craft crochet pouches',
      ticketNumber: 'MD-619',
      description: '* watch youtube videos * practice basic crocheting methods',
      tags: ['buy', 'dress-up', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'backlog',
      index: 0,
    },
    {
      title: 'learn how to crochet',
      ticketNumber: 'MD-620',
      description: "* practice every single day and don't stop",
      tags: ['buy', 'dress-up', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'backlog',
      index: 1,
    },
    {
      title: 'mop the entire house',
      ticketNumber: 'MD-621',
      description: "* practice every single day and don't stop",
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'backlog',
      index: 2,
    },
    {
      title: 'vacuum the rugs in the house',
      ticketNumber: 'MD-622',
      description: "* practice every single day and don't stop",
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'backlog',
      index: 3,
    },
    {
      title: 'research new recipes for the air fryer',
      ticketNumber: 'MD-623',
      description: "* practice every single day and don't stop",
      tags: ['chore', 'fun'],
      dueDate: 'friday, may 26, 2023',
      createdDate: 'tuesday, may 16, 2023',
      swimlaneTitle: 'backlog',
      index: 4,
    },
  ];

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
}
