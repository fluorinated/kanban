import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ready-to-start-lane',
  templateUrl: './ready-to-start-lane.component.html',
  styleUrls: ['./ready-to-start-lane.component.scss'],
})
export class ReadyToStartLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  pageNumber$: Observable<string>;
  rdy2StartLaneMaxPages$: Observable<string>;

  constructor(private boardStore: BoardStore) {
    this.pageNumber$ = this.boardStore.rdy2StartLanePageNumber$;
    this.rdy2StartLaneMaxPages$ = this.boardStore.rdy2StartLaneMaxPages$;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.boardStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
