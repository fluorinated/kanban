import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface BoardStoreState {
  isLoading: boolean;
}

@Injectable()
export class BoardStore extends ComponentStore<BoardStoreState> {
  constructor() {
    super({ isLoading: false });
  }

  // readonly isLoading$: Observable<boolean> = this.select(
  //   (state) => state.isLoading
  // );

  // readonly startLoading = this.updater((state: BoardStoreState) => (
  //   {
  //     ...state,
  //     isLoading: false,
  //   }
  // ));

  // initializeStore = (data): void => {
  //   this.patchState({
  //     response: {
  //       field: field,
  //       field: field
  //     }
  //   });
  // }
}
