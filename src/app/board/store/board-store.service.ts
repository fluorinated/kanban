import { Ticket } from './../../models/ticket.model';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Board } from 'src/app/models/board.model';
import {
  dueTodayTickets,
  filterTickets,
  dueThisWeekTickets,
  dueThisMonthTickets,
} from 'src/app/utils/board.utils';
import { mockBoard, mockBoardTwo, mockTickets } from 'src/mock-data/mock-data';
export interface BoardStoreState {
  currentBoard: Board;
  boards: Board[];
  isTicketOpen: boolean;
  isBoardsListOpen: boolean;
  currentTicket: Ticket;
  searchTerm: string;
  isEditingCurrentBoardTitle: boolean;
  isDueTodayFilterOn: boolean;
  isDueThisWeekFilterOn: boolean;
  isDueThisMonthFilterOn: boolean;
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
      searchTerm: '',
      isEditingCurrentBoardTitle: false,
      isDueTodayFilterOn: false,
      isDueThisWeekFilterOn: false,
      isDueThisMonthFilterOn: false,
    });
  }

  readonly currentBoard$: Observable<Board> = this.select(
    (state) => state.currentBoard
  );

  readonly currentBoardTickets$: Observable<Ticket[]> = this.select(
    this.currentBoard$,
    (currentBoard) => currentBoard?.tickets
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

  readonly searchTerm$: Observable<string> = this.select(
    (state) => state.searchTerm
  );

  readonly isEditingCurrentBoardTitle$: Observable<boolean> = this.select(
    (state) => state.isEditingCurrentBoardTitle
  );

  readonly isDueTodayFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueTodayFilterOn
  );

  readonly isDueThisWeekFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueThisWeekFilterOn
  );

  readonly isDueThisMonthFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueThisMonthFilterOn
  );

  // want to do filtertickets with dueTodayTickets to include search
  // include other filters might have to rethink this soltn
  readonly filteredTickets$: Observable<Ticket[]> = this.select(
    this.searchTerm$,
    this.currentBoardTickets$,
    this.isDueTodayFilterOn$,
    this.isDueThisWeekFilterOn$,
    this.isDueThisMonthFilterOn$,
    (
      searchTerm,
      currentBoardTickets,
      isDueTodayFilterOn,
      isDueThisWeekFilterOn,
      isDueThisMonthFilterOn
    ) => {
      let newTickets = currentBoardTickets;
      if (isDueTodayFilterOn) {
        newTickets = dueTodayTickets(newTickets);
      } else if (isDueThisWeekFilterOn) {
        newTickets = dueThisWeekTickets(newTickets);
      } else if (isDueThisMonthFilterOn) {
        newTickets = dueThisMonthTickets(newTickets);
      }
      newTickets = filterTickets(searchTerm, newTickets);

      return newTickets;
    }
  );

  readonly backlogTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) =>
      filteredTickets.filter((ticket) => ticket?.swimlaneTitle === 'backlog')
  );

  readonly rdy2StartTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) =>
      filteredTickets.filter(
        (ticket) => ticket?.swimlaneTitle === 'rdy 2 start'
      )
  );

  readonly blockedTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) =>
      filteredTickets.filter((ticket) => ticket?.swimlaneTitle === 'blocked')
  );

  readonly inProgressTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) =>
      filteredTickets.filter(
        (ticket) => ticket?.swimlaneTitle === 'in progress'
      )
  );

  readonly doneTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) =>
      filteredTickets.filter((ticket) => ticket?.swimlaneTitle === 'done')
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

  readonly updateCurrentTicketField = this.updater(
    (state: BoardStoreState, pair: { field: string; value: any }) => ({
      ...state,
      currentTicket: { ...state.currentTicket, [pair?.field]: pair?.value },
    })
  );

  readonly updateCurrentBoardField = this.updater(
    (state: BoardStoreState, pair: { field: string; value: any }) => ({
      ...state,
      currentBoard: { ...state.currentBoard, [pair?.field]: pair?.value },
    })
  );

  readonly setSearchTerm = this.updater(
    (state: BoardStoreState, searchTerm: string) => ({
      ...state,
      searchTerm,
    })
  );

  readonly setIsEditingCurrentBoardTitle = this.updater(
    (state: BoardStoreState, isEditingCurrentBoardTitle: boolean) => ({
      ...state,
      isEditingCurrentBoardTitle,
    })
  );

  readonly setIsDueTodayFilterOn = this.updater(
    (state: BoardStoreState, isDueTodayFilterOn: boolean) => ({
      ...state,
      isDueTodayFilterOn,
    })
  );

  readonly setIsDueThisWeekFilterOn = this.updater(
    (state: BoardStoreState, isDueThisWeekFilterOn: boolean) => ({
      ...state,
      isDueThisWeekFilterOn,
    })
  );

  readonly setIsDueThisMonthFilterOn = this.updater(
    (state: BoardStoreState, isDueThisMonthFilterOn: boolean) => ({
      ...state,
      isDueThisMonthFilterOn,
    })
  );

  readonly addTagToCurrentTicket = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentTicket: {
        ...state.currentTicket,
        tags: [...state.currentTicket.tags, tag],
      },
    })
  );

  readonly addNewTicketToBoard = this.updater(
    (state: BoardStoreState, swimlaneTitle: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        tickets: [
          {
            title: 'title',
            ticketNumber: 'MD-619',
            description: 'description',
            tags: [],
            dueDate: 'monday, july 3, 2023',
            createdDate: 'saturday, july 1, 2023',
            swimlaneTitle,
            index: 0,
          },
          ...state.currentBoard.tickets,
        ],
      },
    })
  );

  readonly addNewBoardToBoards = this.updater((state: BoardStoreState) => ({
    ...state,
    boards: [
      ...state.boards,
      {
        title: 'title',
        tickets: mockTickets,
        index: 2,
      },
    ],
    currentBoard: {
      title: 'title',
      tickets: mockTickets,
      index: 2,
    },
  }));

  readonly turnOffMainFilters = this.updater((state: BoardStoreState) => ({
    ...state,
    isDueTodayFilterOn: false,
    isDueThisWeekFilterOn: false,
    isDueThisMonthFilterOn: false,
  }));

  readonly setIsDueTodayFilter = this.effect(
    (setIsDueTodayFilter$: Observable<void>) =>
      setIsDueTodayFilter$.pipe(
        withLatestFrom(this.isDueTodayFilterOn$),
        tap(() => this.turnOffMainFilters()),
        tap(([, isDueTodayFilterOn]) => {
          if (!isDueTodayFilterOn) {
            this.setIsDueTodayFilterOn(true);
          }
        })
      )
  );

  readonly setIsDueThisWeekFilter = this.effect(
    (setIsDueThisWeekFilter$: Observable<void>) =>
      setIsDueThisWeekFilter$.pipe(
        withLatestFrom(this.isDueThisWeekFilterOn$),
        tap(() => this.turnOffMainFilters()),
        tap(([, isDueThisWeekFilterOn]) => {
          if (!isDueThisWeekFilterOn) {
            this.setIsDueThisWeekFilterOn(true);
          }
        })
      )
  );

  readonly setIsDueThisMonthFilter = this.effect(
    (setIsDueThisMonthFilter$: Observable<void>) =>
      setIsDueThisMonthFilter$.pipe(
        withLatestFrom(this.isDueThisMonthFilterOn$),
        tap(() => this.turnOffMainFilters()),
        tap(([, isDueThisMonthFilterOn]) => {
          if (!isDueThisMonthFilterOn) {
            this.setIsDueThisMonthFilterOn(true);
          }
        })
      )
  );
}
