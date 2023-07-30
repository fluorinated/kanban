import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';

@Component({
  selector: 'app-ready-to-start-lane',
  templateUrl: './ready-to-start-lane.component.html',
  styleUrls: ['./ready-to-start-lane.component.scss'],
})
export class ReadyToStartLaneComponent {
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
