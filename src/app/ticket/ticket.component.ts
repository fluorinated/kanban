import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Ticket } from '@models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { TicketStore } from './store/ticket-store.service';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent {
  @Input() ticket: Ticket;

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  isEditingTitle$: Observable<boolean>;
  isEditingDescription$: Observable<boolean>;
  isEditingDueDate$: Observable<boolean>;
  isEditingTagsOrNoTagsYet$: Observable<boolean>;
  isEditingTags$: Observable<boolean>;
  isEditingNewTag$: Observable<boolean>;
  currentBoardTags$: Observable<string[]>;

  constructor(
    private boardStore: BoardStore,
    private ticketStore: TicketStore,
    private swimlaneStore: SwimlaneStore
  ) {
    this.isEditingTitle$ = this.ticketStore.isEditingTitle$;
    this.isEditingDescription$ = this.ticketStore.isEditingDescription$;
    this.isEditingDueDate$ = this.ticketStore.isEditingDueDate$;
    this.isEditingTagsOrNoTagsYet$ = this.boardStore.isEditingTagsOrNoTagsYet$;
    this.isEditingTags$ = this.ticketStore.isEditingTags$;
    this.isEditingNewTag$ = this.ticketStore.isEditingNewTag$;
    this.currentBoardTags$ = this.boardStore.currentBoardTags$;
  }

  tagClicked(tag: string): void {
    this.boardStore.addTagToCurrentTicketSave(tag);
  }

  closeTicket(): void {
    this.closeButtonClicked.emit();
  }

  deleteTicket(): void {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete(this.ticket);
  }

  removeTag(tag: string): void {
    this.boardStore.removeTagFromCurrentTicketSave(tag);
  }

  deleteCurrentBoardTag(tag: string): void {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete(tag);
  }

  toggleSaveStartEditingTags(): void {
    this.ticketStore.toggleSaveStartEditingTags();
  }

  startEditing(field: string): void {
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

  saveEditField(field: string, $event: string): void {
    if (field !== 'newTag') {
      this.boardStore.saveUpdatedCurrentTicketField({
        field,
        value: $event,
      });
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

  cancelNewTag(): void {
    this.ticketStore.setIsEditingNewTag(false);
  }
}
