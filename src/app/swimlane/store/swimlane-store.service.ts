import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, forkJoin, of, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { BoardService } from 'src/app/board/board.service';
import { BoardStore } from 'src/app/board/store/board-store.service';
import { Ticket } from '@models/ticket.model';
import { SwimlaneService } from '../swimlane.service';
import {
  getLanePageNumberTitleFromLane,
  getLanePageNumberFromLane,
  swimlaneTitles,
  getTodayTickets,
  getThisWeekTickets,
  getThisMonthTickets,
  filterTicketsBySearch,
  filterTicketsByMatchingActiveTags,
  sortTickets,
} from '@utils/swimlane.utils';
import { Board } from '@models/board.model';

export interface SwimlaneStoreState {
  backlogLanePageNumber: string;
  rdy2StartLanePageNumber: string;
  blockedLanePageNumber: string;
  inProgressLanePageNumber: string;
  doneLanePageNumber: string;
  backlogLaneMaxPages: string;
  blockedLaneMaxPages: string;
  rdy2StartLaneMaxPages: string;
  inProgressLaneMaxPages: string;
  doneLaneMaxPages: string;
  isDueCreatedTodayFilterOn: boolean;
  isDueCreatedThisWeekFilterOn: boolean;
  isDueCreatedThisMonthFilterOn: boolean;
  isDueFilterOn: boolean;
}

@Injectable()
export class SwimlaneStore extends ComponentStore<SwimlaneStoreState> {
  constructor(
    private boardService: BoardService,
    private swimlaneService: SwimlaneService,
    private boardStore: BoardStore
  ) {
    super({
      backlogLanePageNumber: '1',
      rdy2StartLanePageNumber: '1',
      blockedLanePageNumber: '1',
      inProgressLanePageNumber: '1',
      doneLanePageNumber: '1',
      backlogLaneMaxPages: '1',
      blockedLaneMaxPages: '1',
      rdy2StartLaneMaxPages: '1',
      inProgressLaneMaxPages: '1',
      doneLaneMaxPages: '1',
      isDueCreatedTodayFilterOn: false,
      isDueCreatedThisWeekFilterOn: false,
      isDueCreatedThisMonthFilterOn: false,
      isDueFilterOn: true,
    });
  }

  readonly backlogLanePageNumber$: Observable<string> = this.select(
    (state) => state.backlogLanePageNumber
  );

  readonly rdy2StartLanePageNumber$: Observable<string> = this.select(
    (state) => state.rdy2StartLanePageNumber
  );

  readonly blockedLanePageNumber$: Observable<string> = this.select(
    (state) => state.blockedLanePageNumber
  );

  readonly inProgressLanePageNumber$: Observable<string> = this.select(
    (state) => state.inProgressLanePageNumber
  );

  readonly doneLanePageNumber$: Observable<string> = this.select(
    (state) => state.doneLanePageNumber
  );

  readonly backlogLaneMaxPages$: Observable<string> = this.select(
    (state) => state.backlogLaneMaxPages
  );

  readonly blockedLaneMaxPages$: Observable<string> = this.select(
    (state) => state.blockedLaneMaxPages
  );

  readonly rdy2StartLaneMaxPages$: Observable<string> = this.select(
    (state) => state.rdy2StartLaneMaxPages
  );

  readonly inProgressLaneMaxPages$: Observable<string> = this.select(
    (state) => state.inProgressLaneMaxPages
  );

  readonly doneLaneMaxPages$: Observable<string> = this.select(
    (state) => state.doneLaneMaxPages
  );

  readonly isDueFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueFilterOn
  );

  readonly isDueCreatedTodayFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueCreatedTodayFilterOn
  );

  readonly isDueCreatedThisWeekFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueCreatedThisWeekFilterOn
  );

  readonly isDueCreatedThisMonthFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueCreatedThisMonthFilterOn
  );

  readonly isAnyFilterOn$: Observable<boolean> = this.select(
    this.boardStore.searchTerm$,
    this.boardStore.currentBoardActiveTags$,
    this.isDueCreatedTodayFilterOn$,
    this.isDueCreatedThisWeekFilterOn$,
    this.isDueCreatedThisMonthFilterOn$,
    (
      searchTerm,
      activeTags,
      isDueCreatedTodayOn,
      isDueCreatedThisWeekOn,
      isDueCreatedThisMonthOn
    ) =>
      searchTerm !== '' ||
      (activeTags && activeTags.length > 0) ||
      isDueCreatedTodayOn ||
      isDueCreatedThisWeekOn ||
      isDueCreatedThisMonthOn
  );

  readonly filteredTickets$: Observable<Ticket[]> = this.select(
    this.boardStore.currentBoardActiveTags$,
    this.boardStore.searchTerm$,
    this.boardStore.currentBoardTickets$,
    this.isDueFilterOn$,
    this.isDueCreatedTodayFilterOn$,
    this.isDueCreatedThisWeekFilterOn$,
    this.isDueCreatedThisMonthFilterOn$,
    (
      activeTags,
      searchTerm,
      currentBoardTickets,
      isDueFilterOn,
      isDueCreatedTodayFilterOn,
      isDueCreatedThisWeekFilterOn,
      isDueCreatedThisMonthFilterOn
    ) => {
      let newTickets = currentBoardTickets;
      if (isDueCreatedTodayFilterOn) {
        newTickets = getTodayTickets(newTickets, isDueFilterOn);
      } else if (isDueCreatedThisWeekFilterOn) {
        newTickets = getThisWeekTickets(newTickets, isDueFilterOn);
      } else if (isDueCreatedThisMonthFilterOn) {
        newTickets = getThisMonthTickets(newTickets, isDueFilterOn);
      }
      newTickets = filterTicketsBySearch(searchTerm, newTickets);

      if (activeTags?.length > 0) {
        newTickets = filterTicketsByMatchingActiveTags(activeTags, newTickets);
      }

      return newTickets;
    }
  );

  readonly backlogTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) => {
      filteredTickets = filteredTickets?.filter(
        (ticket) => ticket?.swimlaneTitle === 'backlog'
      );
      return sortTickets(filteredTickets);
    }
  );

  readonly rdy2StartTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) => {
      filteredTickets = filteredTickets?.filter(
        (ticket) => ticket?.swimlaneTitle === 'rdy 2 start'
      );
      return sortTickets(filteredTickets);
    }
  );

  readonly blockedTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) => {
      filteredTickets = filteredTickets?.filter(
        (ticket) => ticket?.swimlaneTitle === 'blocked'
      );
      return sortTickets(filteredTickets);
    }
  );

  readonly inProgressTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) => {
      filteredTickets = filteredTickets?.filter(
        (ticket) => ticket?.swimlaneTitle === 'in progress'
      );
      return sortTickets(filteredTickets);
    }
  );

  readonly doneTickets$: Observable<Ticket[]> = this.select(
    this.filteredTickets$,
    (filteredTickets) => {
      filteredTickets = filteredTickets?.filter(
        (ticket) => ticket?.swimlaneTitle === 'done'
      );
      return sortTickets(filteredTickets);
    }
  );

  readonly toggleIsDueFilterOn = this.updater((state: SwimlaneStoreState) => ({
    ...state,
    isDueFilterOn: !state.isDueFilterOn,
  }));

  readonly setIsDueCreatedTodayFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueCreatedTodayFilterOn: boolean) => ({
      ...state,
      isDueCreatedTodayFilterOn,
    })
  );

  readonly setIsDueCreatedThisWeekFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueCreatedThisWeekFilterOn: boolean) => ({
      ...state,
      isDueCreatedThisWeekFilterOn,
    })
  );

  readonly setIsDueCreatedThisMonthFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueCreatedThisMonthFilterOn: boolean) => ({
      ...state,
      isDueCreatedThisMonthFilterOn,
    })
  );

  readonly turnOffMainFilters = this.updater((state: SwimlaneStoreState) => ({
    ...state,
    isDueCreatedTodayFilterOn: false,
    isDueCreatedThisWeekFilterOn: false,
    isDueCreatedThisMonthFilterOn: false,
  }));

  readonly setLanePageNumber = this.updater(
    (
      state: SwimlaneStoreState,
      pair: { lanePageNumber: string; lane: string }
    ) => {
      let updatedLane = pair.lane;
      updatedLane = getLanePageNumberTitleFromLane[pair.lane];
      return {
        ...state,
        [updatedLane]: pair.lanePageNumber,
      };
    }
  );

  readonly setLaneMaxPages = this.updater(
    (state: SwimlaneStoreState, pair: { maxPages: string; lane: string }) => {
      let updatedLane = pair.lane;
      const maxLanePageNumbers = {
        'backlog': 'backlogLaneMaxPages',
        'rdy 2 start': 'rdy2StartLaneMaxPages',
        'blocked': 'blockedLaneMaxPages',
        'in progress': 'inProgressLaneMaxPages',
        'done': 'doneLaneMaxPages',
      };
      updatedLane = maxLanePageNumbers[pair.lane];
      return {
        ...state,
        [updatedLane]: pair.maxPages,
      };
    }
  );

  readonly determineDeleteItem = this.effect(
    (determineDeleteItem$: Observable<void>) =>
      determineDeleteItem$.pipe(
        tap(() => this.boardStore.setHasAnsweredYesToDelete(true)),
        withLatestFrom(this.boardStore.itemToDelete$),
        tap(([, itemToDelete]) => {
          if (itemToDelete.hasOwnProperty('_id')) {
            this.deleteBoardUpdate(itemToDelete as Board);
          } else if (itemToDelete === 'currentBoard') {
            this.deleteCurrentBoardUpdate();
          } else if (itemToDelete.hasOwnProperty('ticketNumber')) {
            this.boardStore.deleteTicketUpdate(itemToDelete as Ticket);
          } else {
            this.boardStore.deleteCurrentBoardTagUpdate(itemToDelete as string);
          }
        }),
        tap(() => {
          this.boardStore.setHasAnsweredYesToDelete(false);
          this.boardStore.setIsDeleteModalOpen(false);
        })
      )
  );

  readonly changeCurrentBoardUpdatePagination = this.effect(
    (changeCurrentBoardUpdatePagination$: Observable<Board>) =>
      changeCurrentBoardUpdatePagination$.pipe(
        filter((currentBoard) => !!currentBoard),
        switchMap((currentBoard) => {
          this.changeCurrentBoard(currentBoard);

          this.resetPagination();

          const paginatedTicketsBoards$ =
            this.swimlaneService.getTicketsPaginatedWithinBoards();

          return paginatedTicketsBoards$.pipe(
            mergeMap((boardsArray) => {
              this.boardStore.setBoards(boardsArray);
              this.turnOffMainFilters();
              this.getLaneMaxPagesUpdateInit();
              this.boardStore.setIsBoardsListOpen(false);
              return [];
            }),
            catchError((error) => {
              console.log('err changeCurrentBoardUpdatePagination', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly deleteCurrentBoardUpdate = this.effect(
    (deleteCurrentBoardUpdate$: Observable<void>) =>
      deleteCurrentBoardUpdate$.pipe(
        withLatestFrom(this.boardStore.hasAnsweredYesToDelete$),
        filter(([, hasAnsweredYesToDelete]) => hasAnsweredYesToDelete),
        tap(() => this.boardStore.deleteCurrentBoard()),
        switchMap(() => {
          return this.boardService.deleteCurrentBoard().pipe(
            withLatestFrom(this.boardStore.boards$),
            tap(([, boards]) => {
              if (boards[0]) {
                this.changeCurrentBoard(boards[0]);
              }
            }),
            withLatestFrom(
              this.boardStore.searchTerm$,
              this.boardStore.currentBoard$,
              this.isDueCreatedTodayFilterOn$,
              this.isDueCreatedThisWeekFilterOn$,
              this.isDueCreatedThisMonthFilterOn$
            ),
            filter(([, , currentBoard, , , ,]) => !!currentBoard),
            tap(
              ([
                ,
                searchTerm,
                currentBoard,
                isDueCreatedTodayFilterOn,
                isDueCreatedThisWeekFilterOn,
                isDueCreatedThisMonthFilterOn,
              ]) => {
                this.changeCurrentBoardUpdatePagination(currentBoard);

                this.resetPaginationAndFetchBoards({
                  searchTerm,
                  currentBoard,
                  isDueCreatedTodayFilterOn,
                  isDueCreatedThisWeekFilterOn,
                  isDueCreatedThisMonthFilterOn,
                  useFilteredTickets: false,
                });
              }
            ),
            catchError((error: string) => {
              console.log('err deleteCurrentBoardUpdate', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly deleteBoardUpdate = this.effect(
    (deleteBoardUpdate$: Observable<Board>) =>
      deleteBoardUpdate$.pipe(
        withLatestFrom(
          this.boardStore.hasAnsweredYesToDelete$,
          this.boardStore.boards$
        ),
        filter(([, hasAnsweredYesToDelete]) => hasAnsweredYesToDelete),
        tap(([board]) => this.boardStore.deleteBoard(board)),
        switchMap(([board, , boards]) => {
          return this.boardService.deleteBoard(board._id).pipe(
            tap(() => {
              if (boards[0]) {
                this.changeCurrentBoard(boards[0]);
              }
            }),
            withLatestFrom(
              this.boardStore.searchTerm$,
              this.boardStore.currentBoard$,
              this.isDueCreatedTodayFilterOn$,
              this.isDueCreatedThisWeekFilterOn$,
              this.isDueCreatedThisMonthFilterOn$
            ),
            filter(([, , currentBoard, , , ,]) => !!currentBoard),
            tap(
              ([
                ,
                searchTerm,
                currentBoard,
                isDueCreatedTodayFilterOn,
                isDueCreatedThisWeekFilterOn,
                isDueCreatedThisMonthFilterOn,
              ]) => {
                this.changeCurrentBoardUpdatePagination(currentBoard);

                this.resetPaginationAndFetchBoards({
                  searchTerm,
                  currentBoard,
                  isDueCreatedTodayFilterOn,
                  isDueCreatedThisWeekFilterOn,
                  isDueCreatedThisMonthFilterOn,
                  useFilteredTickets: false,
                });
              }
            ),
            catchError((error: string) => {
              console.log('err deleteBoardUpdate', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly changeCurrentBoard = this.effect(
    (changeCurrentBoard$: Observable<Board>) =>
      changeCurrentBoard$.pipe(
        switchMap((board) => {
          return this.boardService.updateCurrentBoardStatus(board._id).pipe(
            tap(() => this.getBoardsPaginatedWithFiltersInit()),
            catchError((error) => {
              console.log('err changeCurrentBoard', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly getBoardsPaginatedWithFiltersInit = this.effect(
    (setSearchTermUpdatePagination$: Observable<void>) => {
      return setSearchTermUpdatePagination$.pipe(
        tap(() => this.resetPagination()),
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            return this.boardService
              .getBoardsPaginatedWithFilters(
                searchTerm,
                currentBoard?._id,
                isDueCreatedTodayFilterOn,
                isDueCreatedThisWeekFilterOn,
                isDueCreatedThisMonthFilterOn
              )
              .pipe(
                tap((boards) => {
                  this.boardStore.setBoards(boards);
                })
              );
          }
        ),
        tap((boards) => {
          const currentBoard = (boards as Board[]).find(
            (board) => board.isCurrentBoard
          );
          if (currentBoard?.tickets) {
            this.getLaneMaxPagesFromTickets(currentBoard?.tickets);
          }
        })
      );
    }
  );

  readonly setSearchTermUpdatePagination = this.effect(
    (setSearchTermUpdatePagination$: Observable<string>) => {
      return setSearchTermUpdatePagination$.pipe(
        tap((value) => this.boardStore.setSearchTerm(value)),
        withLatestFrom(
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        tap(
          ([
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) =>
            this.resetPaginationAndFetchBoards({
              searchTerm,
              currentBoard,
              isDueCreatedTodayFilterOn,
              isDueCreatedThisWeekFilterOn,
              isDueCreatedThisMonthFilterOn,
              useFilteredTickets: true,
            })
        )
      );
    }
  );

  readonly addTagToCurrentBoardActiveTagsUpdatePagination = this.effect(
    (addTagToCurrentBoardActiveTagsUpdatePagination$: Observable<string>) => {
      return addTagToCurrentBoardActiveTagsUpdatePagination$.pipe(
        tap((tag) => this.boardStore.addTagToCurrentBoardActiveTags(tag)),
        withLatestFrom(
          this.boardStore.currentBoardActiveTags$,
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            activeTags,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            return this.boardService
              .setActiveTags(activeTags, currentBoard._id)
              .pipe(
                tap(() =>
                  this.resetPaginationAndFetchBoards({
                    searchTerm,
                    currentBoard,
                    isDueCreatedTodayFilterOn,
                    isDueCreatedThisWeekFilterOn,
                    isDueCreatedThisMonthFilterOn,
                    useFilteredTickets: true,
                  })
                )
              );
          }
        )
      );
    }
  );

  readonly removeTagFromCurrentBoardActiveTagsUpdatePagination = this.effect(
    (
      removeTagFromCurrentBoardActiveTagsUpdatePagination$: Observable<string>
    ) => {
      return removeTagFromCurrentBoardActiveTagsUpdatePagination$.pipe(
        tap((tag) => this.boardStore.removeTagFromCurrentBoardActiveTags(tag)),
        withLatestFrom(
          this.boardStore.currentBoardActiveTags$,
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            activeTags,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            return this.boardService
              .setActiveTags(activeTags, currentBoard._id)
              .pipe(
                tap(() =>
                  this.resetPaginationAndFetchBoards({
                    searchTerm,
                    currentBoard,
                    isDueCreatedTodayFilterOn,
                    isDueCreatedThisWeekFilterOn,
                    isDueCreatedThisMonthFilterOn,
                    useFilteredTickets: true,
                  })
                )
              );
          }
        )
      );
    }
  );

  readonly resetPaginationAndFetchBoards = this.effect(
    (
      resetPaginationAndFetchBoards$: Observable<{
        searchTerm: string;
        currentBoard: Board;
        isDueCreatedTodayFilterOn: boolean;
        isDueCreatedThisWeekFilterOn: boolean;
        isDueCreatedThisMonthFilterOn: boolean;
        useFilteredTickets: boolean;
      }>
    ) => {
      return resetPaginationAndFetchBoards$.pipe(
        mergeMap((vals) => {
          const {
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
            useFilteredTickets,
          } = vals;

          this.resetPagination();

          return this.boardService
            .getBoardsPaginatedWithFilters(
              searchTerm,
              currentBoard._id,
              isDueCreatedTodayFilterOn,
              isDueCreatedThisWeekFilterOn,
              isDueCreatedThisMonthFilterOn
            )
            .pipe(
              tap((boards) => this.boardStore.setBoards(boards)),
              withLatestFrom(this.filteredTickets$),
              tap(([_, filteredTickets]) => {
                if (useFilteredTickets && filteredTickets) {
                  this.getLaneMaxPagesFromTickets(filteredTickets);
                } else {
                  this.getLaneMaxPagesFromTickets(currentBoard.tickets);
                }
              })
            );
        })
      );
    }
  );

  readonly setIsDueCreatedTodayFilter = this.effect(
    (setIsDueCreatedTodayFilter$: Observable<void>) => {
      return setIsDueCreatedTodayFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        tap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueCreatedTodayFilterOn) {
              this.setIsDueCreatedTodayFilterOn(true);
            }

            this.resetPaginationAndFetchBoards({
              searchTerm,
              currentBoard,
              isDueCreatedTodayFilterOn,
              isDueCreatedThisWeekFilterOn,
              isDueCreatedThisMonthFilterOn,
              useFilteredTickets: true,
            });
          }
        )
      );
    }
  );

  readonly setIsDueCreatedThisWeekFilter = this.effect(
    (setIsDueCreatedThisWeekFilter$: Observable<void>) =>
      setIsDueCreatedThisWeekFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        tap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueCreatedThisWeekFilterOn) {
              this.setIsDueCreatedThisWeekFilterOn(true);
            }

            this.resetPaginationAndFetchBoards({
              searchTerm,
              currentBoard,
              isDueCreatedTodayFilterOn,
              isDueCreatedThisWeekFilterOn,
              isDueCreatedThisMonthFilterOn,
              useFilteredTickets: true,
            });
          }
        )
      )
  );

  readonly setIsDueCreatedThisMonthFilter = this.effect(
    (setIsDueCreatedThisMonthFilter$: Observable<void>) =>
      setIsDueCreatedThisMonthFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueCreatedTodayFilterOn$,
          this.isDueCreatedThisWeekFilterOn$,
          this.isDueCreatedThisMonthFilterOn$
        ),
        tap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueCreatedTodayFilterOn,
            isDueCreatedThisWeekFilterOn,
            isDueCreatedThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueCreatedThisMonthFilterOn) {
              this.setIsDueCreatedThisMonthFilterOn(true);
            }

            this.resetPaginationAndFetchBoards({
              searchTerm,
              currentBoard,
              isDueCreatedTodayFilterOn,
              isDueCreatedThisWeekFilterOn,
              isDueCreatedThisMonthFilterOn,
              useFilteredTickets: true,
            });
          }
        )
      )
  );

  readonly getLaneMaxPagesFromTickets = this.effect(
    (getLaneMaxPagesFromTickets$: Observable<Ticket[]>) => {
      return getLaneMaxPagesFromTickets$.pipe(
        map((tickets) => {
          const swimlaneMaxPagesMap = new Map<string, number>();

          if (!tickets || tickets.length === 0) {
            swimlaneTitles.forEach((swimlaneTitle) =>
              swimlaneMaxPagesMap.set(swimlaneTitle, 1)
            );
          } else {
            swimlaneTitles.forEach((swimlaneTitle) =>
              swimlaneMaxPagesMap.set(swimlaneTitle, 1)
            );

            // calculate maxPages based on the number of tickets in each swimlane
            tickets.forEach((ticket) => {
              const swimlane = ticket.swimlaneTitle;

              if (!swimlaneMaxPagesMap.has(swimlane)) {
                swimlaneMaxPagesMap.set(swimlane, 1);
              }

              const currentPageCount = swimlaneMaxPagesMap.get(swimlane) || 1;
              const ticketsPerPage = 10;
              const swimlaneTickets = tickets.filter(
                (t) => t.swimlaneTitle === swimlane
              );
              const ticketPageCount = Math.ceil(
                swimlaneTickets.length / ticketsPerPage
              );

              if (ticketPageCount > currentPageCount) {
                swimlaneMaxPagesMap.set(swimlane, ticketPageCount);
              }
            });
          }

          const maxPagesResults = Array.from(swimlaneMaxPagesMap.entries()).map(
            ([lane, maxPages]) => ({
              lane,
              maxPages: maxPages.toString(),
            })
          );

          return maxPagesResults;
        }),
        tap((results: { lane: string; maxPages: string }[]) =>
          results.forEach((result) => this.setLaneMaxPages(result))
        )
      );
    }
  );

  readonly getLaneMaxPagesUpdate = this.effect(
    (getLaneMaxPagesUpdate$: Observable<Board>) => {
      return getLaneMaxPagesUpdate$.pipe(
        switchMap((currentBoard) => {
          return currentBoard
            ? forkJoin(
                swimlaneTitles.map((lane) =>
                  this.swimlaneService.getMaxPagesForSwimlane(lane)
                )
              ).pipe(
                map((maxPagesArray) =>
                  maxPagesArray.map((maxPages, index) => ({
                    lane: swimlaneTitles[index],
                    maxPages: maxPages?.maxPages.toString(),
                  }))
                )
              )
            : of([]);
        }),
        tap((results: { lane: string; maxPages: string }[]) => {
          results.forEach((result) => {
            this.setLaneMaxPages(result);
          });
        })
      );
    }
  );

  readonly resetPagination = this.effect(
    (resetPagination$: Observable<void>) => {
      return resetPagination$.pipe(
        switchMap(() => {
          const resetPageObservables = swimlaneTitles.map((swimlaneTitle) => {
            return this.getTicketsPaginated('1', swimlaneTitle).pipe(
              catchError((error) => {
                console.error('Error in resetPagination:', error);
                return of(null);
              })
            );
          });

          return forkJoin(resetPageObservables);
        })
      );
    }
  );

  readonly getLaneMaxPagesUpdateInit = this.effect(
    (getLaneMaxPagesUpdate$: Observable<void>) =>
      getLaneMaxPagesUpdate$.pipe(
        switchMap(() => {
          const requests = swimlaneTitles.map((lane) =>
            this.swimlaneService.getMaxPagesForSwimlane(lane).pipe(
              map((maxPages) => ({
                lane,
                maxPages: maxPages?.maxPages.toString(),
              }))
            )
          );

          return forkJoin(requests).pipe(
            tap((results: { lane: string; maxPages: string }[]) => {
              results.forEach((result) => {
                this.setLaneMaxPages(result);
              });
            })
          );
        })
      )
  );

  readonly dropUpdateTicketSwimlane = this.effect(
    (dropUpdateTicketSwimlane$: Observable<CdkDragDrop<string[]>>) =>
      dropUpdateTicketSwimlane$.pipe(
        tap((event) => this.swimlaneService.drop(event)),
        withLatestFrom(
          this.backlogLanePageNumber$,
          this.rdy2StartLanePageNumber$,
          this.blockedLanePageNumber$,
          this.inProgressLanePageNumber$,
          this.doneLanePageNumber$
        ),
        switchMap(
          ([
            event,
            backlogLanePageNumber,
            rdy2StartLanePageNumber,
            blockedLanePageNumber,
            inProgressLanePageNumber,
            doneLanePageNumber,
          ]) => {
            const getTitleFromContainerId = (containerId: string): string => {
              const containerIdToTitleMap = {
                'cdk-drop-list-0': 'backlog',
                'cdk-drop-list-1': 'rdy 2 start',
                'cdk-drop-list-2': 'blocked',
                'cdk-drop-list-3': 'in progress',
                'cdk-drop-list-4': 'done',
              };
              return containerIdToTitleMap[containerId] || '';
            };
            const title = getTitleFromContainerId(event.container.id);
            if (!title) {
              console.log('invalid swimlane title');
              return EMPTY;
            }

            const ticket = event.container.data[event.currentIndex];

            let lanePageNumber = '1';
            lanePageNumber = getLanePageNumberFromLane(
              backlogLanePageNumber,
              rdy2StartLanePageNumber,
              blockedLanePageNumber,
              inProgressLanePageNumber,
              doneLanePageNumber
            )[title];

            return this.swimlaneService
              .updateTicketSwimlane(
                title,
                ticket['ticketNumber'],
                event.currentIndex,
                event.previousIndex,
                ticket['swimlaneTitle'],
                lanePageNumber
              )
              .pipe(
                tap(() => {
                  this.resetPagination();
                  this.getBoardsPaginatedWithFiltersInit();
                  this.getLaneMaxPagesUpdateInit();
                }),
                catchError((error) => {
                  console.log('err dropUpdateTicketSwimlane', error);
                  return throwError(error);
                })
              );
          }
        )
      )
  );

  readonly addNewBoardToBoardsUpdate = this.effect(
    (addNewBoardToBoardsUpdate$: Observable<void>) =>
      addNewBoardToBoardsUpdate$.pipe(
        switchMap(() => {
          return this.boardService.addNewBoardToBoards().pipe(
            tap(() => this.getBoardsPaginatedWithFiltersInit()),
            catchError((error: string) => {
              console.log('err addNewBoardToBoardsUpdate', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly addNewTicketToSwimlane = this.effect(
    (addNewTicketToBoard$: Observable<string>) =>
      addNewTicketToBoard$.pipe(
        switchMap((swimlaneTitle) => {
          return this.swimlaneService
            .addTicketToCurrentBoard(swimlaneTitle)
            .pipe(
              tap((boards) => {
                const currentBoardTickets = boards['boards'].find(
                  (board) => board.isCurrentBoard
                )?.tickets;
                swimlaneTitles.map((swimlaneTitle) =>
                  this.setLanePageNumber({
                    lanePageNumber: '1',
                    lane: swimlaneTitle,
                  })
                );
                this.boardStore.setBoards(boards['boards']);
                this.getLaneMaxPagesFromTickets(currentBoardTickets);
              }),
              catchError((error) => {
                console.log(
                  'err addNewTicketToBoard addTicketToCurrentBoard',
                  error
                );
                return throwError(error);
              })
            );
        })
      )
  );

  getTicketsPaginated = (
    pageNumber: string,
    swimlaneTitle: string
  ): Observable<Ticket[]> => {
    return this.swimlaneService
      .getCurrentBoardSwimlaneTicketsPaginated(pageNumber, swimlaneTitle)
      .pipe(
        tap((newSwimlaneTickets: Ticket[]) => {
          this.boardStore.setCurrentBoardSwimlaneTickets({
            swimlaneTitle,
            newSwimlaneTickets,
          });
          this.setLanePageNumber({
            lanePageNumber: pageNumber,
            lane: swimlaneTitle,
          });
        }),
        catchError((error) => {
          console.error('Error in getTicketsPaginated:', error);
          return throwError(error);
        })
      );
  };

  readonly pageBack = this.effect((pageBack$: Observable<string>) =>
    pageBack$.pipe(
      withLatestFrom(
        this.backlogLanePageNumber$,
        this.rdy2StartLanePageNumber$,
        this.blockedLanePageNumber$,
        this.inProgressLanePageNumber$,
        this.doneLanePageNumber$
      ),
      switchMap(
        ([
          swimlaneTitle,
          backlogLanePageNumber,
          rdy2StartLanePageNumber,
          blockedLanePageNumber,
          inProgressLanePageNumber,
          doneLanePageNumber,
        ]) => {
          let lanePageNumber;
          lanePageNumber = getLanePageNumberFromLane(
            backlogLanePageNumber,
            rdy2StartLanePageNumber,
            blockedLanePageNumber,
            inProgressLanePageNumber,
            doneLanePageNumber
          )[swimlaneTitle];

          if (lanePageNumber === 1) {
            console.log('No more previous pages');
            return EMPTY;
          }

          const pageNumber = (parseInt(lanePageNumber) - 1).toString();

          return this.getTicketsPaginated(pageNumber, swimlaneTitle);
        }
      )
    )
  );
  readonly pageForward = this.effect((pageForward$: Observable<string>) =>
    pageForward$.pipe(
      withLatestFrom(
        this.backlogLanePageNumber$,
        this.rdy2StartLanePageNumber$,
        this.blockedLanePageNumber$,
        this.inProgressLanePageNumber$,
        this.doneLanePageNumber$
      ),
      switchMap(
        ([
          swimlaneTitle,
          backlogLanePageNumber,
          rdy2StartLanePageNumber,
          blockedLanePageNumber,
          inProgressLanePageNumber,
          doneLanePageNumber,
        ]) => {
          const lanePageNumbers = getLanePageNumberFromLane(
            backlogLanePageNumber,
            rdy2StartLanePageNumber,
            blockedLanePageNumber,
            inProgressLanePageNumber,
            doneLanePageNumber
          );
          const currentLanePageNumber = parseInt(
            lanePageNumbers[swimlaneTitle]
          );
          const nextPageNumber = (currentLanePageNumber + 1).toString();

          return this.getTicketsPaginated(nextPageNumber, swimlaneTitle);
        }
      )
    )
  );
}
