import { Ticket } from './../../models/ticket.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Board } from 'src/app/models/board.model';
import { mockBoard, mockBoardTwo } from 'src/mock-data/mock-data';

export interface BoardStoreState {
  currentBoard: Board;
  boards: Board[];
  isTicketOpen: boolean;
  isBoardsListOpen: boolean;
  currentTicket: Ticket;
}

@Injectable()
export class BoardStore extends ComponentStore<BoardStoreState> {
  constructor() {
    super({
      currentBoard: mockBoard,
      boards: [mockBoard, mockBoardTwo],
      isTicketOpen: false,
      isBoardsListOpen: false,
      currentTicket: null,
    });
  }

  readonly currentBoard$: Observable<Board> = this.select(
    (state) => state.currentBoard
  );

  readonly boards$: Observable<Board[]> = this.select((state) => state.boards);

  readonly isTicketOpen$: Observable<boolean> = this.select(
    (state) => state.isTicketOpen
  );

  readonly isBoardsListOpen$: Observable<boolean> = this.select(
    (state) => state.isBoardsListOpen
  );

  readonly currentTicket$: Observable<Ticket> = this.select(
    (state) => state.currentTicket
  );

  readonly backlogTickets$: Observable<Ticket[]> = this.select((state) =>
    state.currentBoard?.tickets?.filter(
      (ticket) => ticket?.swimlaneTitle === 'backlog'
    )
  );

  readonly rdy2StartTickets$: Observable<Ticket[]> = this.select((state) =>
    state.currentBoard?.tickets?.filter(
      (ticket) => ticket?.swimlaneTitle === 'rdy 2 start'
    )
  );

  readonly blockedTickets$: Observable<Ticket[]> = this.select((state) =>
    state.currentBoard?.tickets?.filter(
      (ticket) => ticket?.swimlaneTitle === 'blocked'
    )
  );

  readonly inProgressTickets$: Observable<Ticket[]> = this.select((state) =>
    state.currentBoard?.tickets?.filter(
      (ticket) => ticket?.swimlaneTitle === 'in progress'
    )
  );

  readonly doneTickets$: Observable<Ticket[]> = this.select((state) =>
    state.currentBoard?.tickets?.filter(
      (ticket) => ticket?.swimlaneTitle === 'done'
    )
  );

  readonly setCurrentBoard = this.updater(
    (state: BoardStoreState, currentBoard: Board) => ({
      ...state,
      currentBoard,
    })
  );

  readonly setIsTicketOpen = this.updater(
    (state: BoardStoreState, isTicketOpen: boolean) => ({
      ...state,
      isTicketOpen,
    })
  );

  readonly setIsBoardsListOpen = this.updater(
    (state: BoardStoreState, isBoardsListOpen: boolean) => ({
      ...state,
      isBoardsListOpen,
    })
  );

  readonly setCurrentTicket = this.updater(
    (state: BoardStoreState, currentTicket: Ticket) => ({
      ...state,
      currentTicket,
    })
  );
}
