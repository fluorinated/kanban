import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '@models/ticket.model';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-done-lane',
  templateUrl: './done-lane.component.html',
  styleUrls: ['./done-lane.component.scss'],
})
export class DoneLaneComponent {
  @Input() tickets: Ticket[];
  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  pageNumber$: Observable<string>;
  doneLaneMaxPages$: Observable<string>;
  isAnyFilterOn$: Observable<boolean>;

  constructor(private swimlaneStore: SwimlaneStore) {
    this.pageNumber$ = this.swimlaneStore.doneLanePageNumber$;
    this.doneLaneMaxPages$ = this.swimlaneStore.doneLaneMaxPages$;
    this.isAnyFilterOn$ = this.swimlaneStore.isAnyFilterOn$;
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.swimlaneStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
