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

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();
  isEditingTitle$: Observable<boolean>;
  isEditingDescription$: Observable<boolean>;
  isEditingDueDate$: Observable<boolean>;
  isEditingTagsOrNoTagsYet$: Observable<boolean>;
  isEditingTags$: Observable<boolean>;
  isEditingNewTag$: Observable<boolean>;
  currentBoardTags$: Observable<string[]>;

  constructor(
    private boardStore: BoardStore,
    private ticketStore: TicketStore
  ) {
    this.isEditingTitle$ = this.ticketStore.isEditingTitle$;
    this.isEditingDescription$ = this.ticketStore.isEditingDescription$;
    this.isEditingDueDate$ = this.ticketStore.isEditingDueDate$;
    this.isEditingTagsOrNoTagsYet$ = this.boardStore.isEditingTagsOrNoTagsYet$;
    this.isEditingTags$ = this.ticketStore.isEditingTags$;
    this.isEditingNewTag$ = this.ticketStore.isEditingNewTag$;
    this.currentBoardTags$ = this.boardStore.currentBoardTags$;
  }

  ngOnInit() {}

  tagClicked(tag: string) {
    this.boardStore.addTagToCurrentTicketSave(tag);
  }

  closeTicket() {
    this.closeButtonClicked.emit();
  }

  deleteTicket() {
    this.boardStore.deleteTicketUpdate(this.ticket);
  }

  removeTag(tag: string) {
    this.boardStore.removeTagFromCurrentTicketSave(tag);
  }

  deleteCurrentBoardTag(tag: string) {
    this.boardStore.deleteCurrentBoardTag(tag);
  }

  toggleSaveStartEditingTags() {
    this.ticketStore.toggleSaveStartEditingTags();
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
      case 'newTag':
        this.ticketStore.setIsEditingNewTag(true);
        break;
    }
  }

  saveEditField(field: string, $event: string) {
    if (field !== 'newTag') {
      this.boardStore.saveUpdatedCurrentTicketField({ field, value: $event });
    }
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
      case 'newTag':
        this.ticketStore.setNewTagName($event);
        this.boardStore.addNewTagToCurrentBoardTags();
        break;
    }
  }

  cancelNewTag() {
    this.ticketStore.setIsEditingNewTag(false);
  }
}
