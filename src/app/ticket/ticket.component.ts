import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { TicketStore } from './store/ticket-store.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @Input() ticket: Ticket;
  @Input() tags: string[];

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();
  isEditingTitle$: Observable<boolean>;
  isEditingDescription$: Observable<boolean>;
  isEditingDueDate$: Observable<boolean>;
  isEditingTags$: Observable<boolean>;

  constructor(
    private boardStore: BoardStore,
    private ticketStore: TicketStore
  ) {
    this.isEditingTitle$ = this.ticketStore.isEditingTitle$;
    this.isEditingDescription$ = this.ticketStore.isEditingDescription$;
    this.isEditingDueDate$ = this.ticketStore.isEditingDueDate$;
    this.isEditingTags$ = this.ticketStore.isEditingTags$;
  }

  ngOnInit() {}

  tagClicked(tag: string) {
    this.boardStore.addTagToCurrentTicket(tag);
  }

  closeTicket() {
    this.closeButtonClicked.emit();
  }

  removeTag(tag: string) {
    this.boardStore.removeTagFromCurrentTicket(tag);
  }

  startEditing(field: string) {
    switch (field) {
      case 'title':
        this.ticketStore.setIsEditingTitle(true);
        break;
      case 'description':
        this.ticketStore.setIsEditingDescription(true);
        break;
      case 'dueDate':
        this.ticketStore.setIsEditingDueDate(true);
        break;
      case 'tags':
        this.ticketStore.setIsEditingTags(true);
        break;
    }
  }

  saveEditField(field: string, $event: string) {
    this.boardStore.updateCurrentTicketField({ field, value: $event });
    switch (field) {
      case 'title':
        this.ticketStore.setIsEditingTitle(false);
        break;
      case 'description':
        this.ticketStore.setIsEditingDescription(false);
        break;
      case 'dueDate':
        this.ticketStore.setIsEditingDueDate(false);
        break;
      case 'tags':
        this.ticketStore.setIsEditingTags(false);
        break;
    }
  }
}
