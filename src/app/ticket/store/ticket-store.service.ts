import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';

export interface TicketStoreState {
  isEditingTitle: boolean;
  isEditingDescription: boolean;
  isEditingDueDate: boolean;
  isEditingTags: boolean;
  isEditingNewTag: boolean;
  newTagName: string;
  tagsMap: Map<string, string>;
}

@Injectable()
export class TicketStore extends ComponentStore<TicketStoreState> {
  constructor() {
    super({
      isEditingTitle: false,
      isEditingDescription: false,
      isEditingDueDate: false,
      isEditingTags: false,
      isEditingNewTag: false,
      newTagName: '',
      tagsMap: new Map(),
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

  readonly isEditingNewTag$: Observable<boolean> = this.select(
    (state) => state.isEditingNewTag
  );

  readonly newTagName$: Observable<string> = this.select(
    (state) => state.newTagName
  );

  readonly getTagsMap$: Observable<Map<string, string>> = this.select(
    (state) => state.tagsMap
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

  readonly setIsEditingNewTag = this.updater(
    (state: TicketStoreState, isEditingNewTag: boolean) => ({
      ...state,
      isEditingNewTag,
    })
  );

  readonly setNewTagName = this.updater(
    (state: TicketStoreState, newTagName: string) => ({
      ...state,
      newTagName,
    })
  );

  readonly setTagsMap = this.updater(
    (state: TicketStoreState, tagsMap: Map<string, string>) => ({
      ...state,
      tagsMap,
    })
  );

  readonly toggleSaveStartEditingTags = this.effect(
    (toggleSaveStartEditingTags$: Observable<void>) =>
      toggleSaveStartEditingTags$.pipe(
        withLatestFrom(this.isEditingTags$),
        tap(([, isEditingTags]: [any, boolean]) => {
          this.setIsEditingTags(!isEditingTags);
        }),
        tap(() => this.setIsEditingNewTag(false))
      )
  );
}
