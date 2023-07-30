import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';

@Component({
  selector: 'app-done-lane',
  templateUrl: './done-lane.component.html',
  styleUrls: ['./done-lane.component.scss'],
})
export class DoneLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  constructor(private boardStore: BoardStore) {}

  drop(event: CdkDragDrop<string[]>) {
    this.boardStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
