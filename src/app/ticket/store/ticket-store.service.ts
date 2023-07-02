import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface TicketStoreState {
  isEditingTitle: boolean;
  isEditingDescription: boolean;
  isEditingDueDate: boolean;
  isEditingTags: boolean;
}

@Injectable()
export class TicketStore extends ComponentStore<TicketStoreState> {
  constructor() {
    super({
      isEditingTitle: false,
      isEditingDescription: false,
      isEditingDueDate: false,
      isEditingTags: false,
    });
  }

  readonly isEditingTitle$: Observable<boolean> = this.select(
    (state) => state.isEditingTitle
  );

  readonly isEditingDescription$: Observable<boolean> = this.select(
    (state) => state.isEditingDescription
  );

  readonly isEditingDueDate$: Observable<boolean> = this.select(
    (state) => state.isEditingDueDate
  );

  readonly isEditingTags$: Observable<boolean> = this.select(
    (state) => state.isEditingTags
  );

  readonly setIsEditingTitle = this.updater(
    (state: TicketStoreState, isEditingTitle: boolean) => ({
      ...state,
      isEditingTitle,
    })
  );

  readonly setIsEditingDescription = this.updater(
    (state: TicketStoreState, isEditingDescription: boolean) => ({
      ...state,
      isEditingDescription,
    })
  );

  readonly setIsEditingDueDate = this.updater(
    (state: TicketStoreState, isEditingDueDate: boolean) => ({
      ...state,
      isEditingDueDate,
    })
  );

  readonly setIsEditingTags = this.updater(
    (state: TicketStoreState, isEditingTags: boolean) => ({
      ...state,
      isEditingTags,
    })
  );
}
