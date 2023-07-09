import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardService } from '../board/board.service';
import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-in-progress-lane',
  templateUrl: './in-progress-lane.component.html',
  styleUrls: ['./in-progress-lane.component.scss'],
})
export class InProgressLaneComponent {
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
