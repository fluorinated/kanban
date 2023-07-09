import { Ticket } from '../../models/ticket.model';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { finalize, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Board } from 'src/app/models/board.model';
import { TicketStore } from 'src/app/ticket/store/ticket-store.service';
import {
  dueTodayTickets,
  dueThisWeekTickets,
  dueThisMonthTickets,
  filterTicketsBySearch,
  filterTicketsByMatchingActiveTags,
} from 'src/app/utils/board.utils';
import { mockBoard, mockBoardTwo, mockTickets } from 'src/mock-data/mock-data';
import { BoardService } from '../board.service';
export interface BoardStoreState {
  currentBoard: Board;
  boards: Board[];
  isTicketOpen: boolean;
  isBoardsListOpen: boolean;
  isFiltersListOpen: boolean;
  currentTicket: Ticket;
  searchTerm: string;
  isEditingCurrentBoardTitle: boolean;
  isDueTodayFilterOn: boolean;
  isDueThisWeekFilterOn: boolean;
  isDueThisMonthFilterOn: boolean;
}

@Injectable()
export class BoardStore extends ComponentStore<BoardStoreState> {
  constructor(
    private ticketStore: TicketStore,
    private boardService: BoardService
  ) {
    super({
      currentBoard: mockBoard,
      boards: [mockBoard, mockBoardTwo],
      isTicketOpen: false,
      isBoardsListOpen: false,
      isFiltersListOpen: false,
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

  readonly currentBoardTags$: Observable<string[]> = this.select(
    this.currentBoard$,
    (currentBoard) => currentBoard?.tags
  );

  readonly currentBoardActiveTags$: Observable<string[]> = this.select(
    this.currentBoard$,
    (currentBoard) => currentBoard?.activeTags
  );

  readonly currentBoardCollapsedLanes$: Observable<string[]> = this.select(
    this.currentBoard$,
    (currentBoard) => currentBoard?.collapsedLanes
  );

  readonly boards$: Observable<Board[]> = this.select((state) => state.boards);

  readonly isTicketOpen$: Observable<boolean> = this.select(
    (state) => state.isTicketOpen
  );

  readonly isBoardsListOpen$: Observable<boolean> = this.select(
    (state) => state.isBoardsListOpen
  );

  readonly isFiltersListOpen$: Observable<boolean> = this.select(
    (state) => state.isFiltersListOpen
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

  readonly filteredTickets$: Observable<Ticket[]> = this.select(
    this.currentBoardActiveTags$,
    this.searchTerm$,
    this.currentBoardTickets$,
    this.isDueTodayFilterOn$,
    this.isDueThisWeekFilterOn$,
    this.isDueThisMonthFilterOn$,
    (
      activeTags,
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
      newTickets = filterTicketsBySearch(searchTerm, newTickets);
      newTickets = filterTicketsByMatchingActiveTags(activeTags, newTickets);

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

  readonly setIsFiltersListOpen = this.updater(
    (state: BoardStoreState, isFiltersListOpen: boolean) => ({
      ...state,
      isFiltersListOpen,
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

  readonly addCollapsedLaneToCurrentBoard = this.updater(
    (state: BoardStoreState, lane: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        collapsedLanes: [...state.currentBoard.collapsedLanes, lane],
      },
    })
  );

  readonly removeCollapsedLaneToCurrentBoard = this.updater(
    (state: BoardStoreState, lane: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        collapsedLanes: state.currentBoard.collapsedLanes.filter(
          (collapsedLane) => collapsedLane !== lane
        ),
      },
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

  readonly setCurrentBoardActiveTags = this.updater(
    (state: BoardStoreState, currentBoardActiveTags: Board) => ({
      ...state,
      currentBoardActiveTags,
    })
  );

  readonly addTagToCurrentBoardActiveTags = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        activeTags: [...new Set([...state.currentBoard.activeTags, tag])],
      },
    })
  );

  readonly removeTagFromCurrentBoardActiveTags = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        activeTags: [...state.currentBoard.activeTags].filter(
          (currentTag) => currentTag !== tag
        ),
      },
    })
  );

  readonly addTagToCurrentTicket = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentTicket: {
        ...state.currentTicket,
        tags: [...new Set([...state.currentTicket.tags, tag])],
      },
    })
  );

  readonly addTagToCurrentBoard = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentBoard: {
        ...state.currentBoard,
        tags: [...new Set([...state.currentBoard.tags, tag])],
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
        tags: [],
        activeTags: [],
        index: 2,
        collapsedLanes: [],
      },
    ],
    currentBoard: {
      title: 'title',
      tickets: mockTickets,
      tags: [],
      activeTags: [],
      index: 2,
      collapsedLanes: [],
    },
  }));

  readonly turnOffMainFilters = this.updater((state: BoardStoreState) => ({
    ...state,
    isDueTodayFilterOn: false,
    isDueThisWeekFilterOn: false,
    isDueThisMonthFilterOn: false,
  }));

  readonly removeTagFromCurrentTicket = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentTicket: {
        ...state.currentTicket,
        tags: [...state.currentTicket.tags].filter(
          (currentTag) => currentTag !== tag
        ),
      },
    })
  );

  readonly setIsDueTodayFilter = this.effect(
    (setIsDueTodayFilter$: Observable<void>) => {
      return setIsDueTodayFilter$.pipe(
        withLatestFrom(this.isDueTodayFilterOn$),
        tap(() => this.turnOffMainFilters()),
        tap(([, isDueTodayFilterOn]) => {
          if (!isDueTodayFilterOn) {
            this.setIsDueTodayFilterOn(true);
          }
        }),
        switchMap(() => {
          return this.boardService.getBalance().pipe(
            tapResponse(
              (res) => {
                console.log('res', res);
              },
              (error: string) => console.log('err')
            ),
            finalize(() => console.log('finalize'))
          );
        })
      );
    }
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

  readonly addNewTagToCurrentBoardTags = this.effect(
    (addNewTagToCurrentBoardTags$: Observable<void>) =>
      addNewTagToCurrentBoardTags$.pipe(
        withLatestFrom(this.ticketStore.newTagName$),
        tap(([, newTagName]: [any, string]) =>
          this.addTagToCurrentBoard(newTagName)
        ),
        tap(() => this.ticketStore.setIsEditingNewTag(false))
      )
  );
}
