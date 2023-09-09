import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '@models/ticket.model';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

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
  isAnyFilterOn$: Observable<boolean>;

  constructor(private swimlaneStore: SwimlaneStore) {
    this.pageNumber$ = this.swimlaneStore.backlogLanePageNumber$;
    this.backlogLaneMaxPages$ = this.swimlaneStore.backlogLaneMaxPages$;
    this.isAnyFilterOn$ = this.swimlaneStore.isAnyFilterOn$;
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.swimlaneStore.dropUpdateTicketSwimlane(event);
  }

  openTicket(ticket: Ticket): void {
    this.ticketClicked.emit(ticket);
  }
}
