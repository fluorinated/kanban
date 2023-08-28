import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-backlog-lane',
  templateUrl: './backlog-lane.component.html',
  styleUrls: ['./backlog-lane.component.scss'],
})
export class BacklogLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  pageNumber$: Observable<string>;
  backlogLaneMaxPages$: Observable<string>;
  constructor(private boardStore: BoardStore) {
    this.pageNumber$ = this.boardStore.backlogLanePageNumber$;
    this.backlogLaneMaxPages$ = this.boardStore.backlogLaneMaxPages$;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.boardStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
