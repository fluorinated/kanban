import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blocked-lane',
  templateUrl: './blocked-lane.component.html',
  styleUrls: ['./blocked-lane.component.scss'],
})
export class BlockedLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  pageNumber$: Observable<string>;
  blockedLaneMaxPages$: Observable<string>;

  constructor(private boardStore: BoardStore) {
    this.pageNumber$ = this.boardStore.blockedLanePageNumber$;
    this.blockedLaneMaxPages$ = this.boardStore.blockedLaneMaxPages$;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.boardStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
