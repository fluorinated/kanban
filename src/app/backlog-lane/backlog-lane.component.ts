import { BoardService } from './../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-backlog-lane',
  templateUrl: './backlog-lane.component.html',
  styleUrls: ['./backlog-lane.component.scss'],
})
export class BacklogLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardService.drop(event);
  }
  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
