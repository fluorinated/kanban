import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardService } from '../board/board.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-done-lane',
  templateUrl: './done-lane.component.html',
  styleUrls: ['./done-lane.component.scss'],
})
export class DoneLaneComponent {
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
