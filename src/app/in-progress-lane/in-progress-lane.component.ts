import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-in-progress-lane',
  templateUrl: './in-progress-lane.component.html',
  styleUrls: ['./in-progress-lane.component.scss'],
})
export class InProgressLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  pageNumber$: Observable<string>;
  inProgressLaneMaxPages$: Observable<string>;
  constructor(private boardStore: BoardStore) {
    this.pageNumber$ = this.boardStore.inProgressLanePageNumber$;
    this.inProgressLaneMaxPages$ = this.boardStore.inProgressLaneMaxPages$;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.boardStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
