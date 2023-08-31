import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '@models/ticket.model';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

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
  constructor(private swimlaneStore: SwimlaneStore) {
    this.pageNumber$ = this.swimlaneStore.inProgressLanePageNumber$;
    this.inProgressLaneMaxPages$ = this.swimlaneStore.inProgressLaneMaxPages$;
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.swimlaneStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
