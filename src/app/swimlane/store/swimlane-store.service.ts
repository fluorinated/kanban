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
import { getFormattedDate } from '@utils/board.utils';
import { BoardStore } from 'src/app/board/store/board-store.service';
import { Ticket } from '@models/ticket.model';
import { SwimlaneService } from '../swimlane.service';
import {
  getLanePageNumberTitleFromLane,
  getLanePageNumberFromLane,
  swimlaneTitles,
  dueTodayTickets,
  dueThisWeekTickets,
  dueThisMonthTickets,
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
  isDueTodayFilterOn: boolean;
  isDueThisWeekFilterOn: boolean;
  isDueThisMonthFilterOn: boolean;
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
      isDueTodayFilterOn: false,
      isDueThisWeekFilterOn: false,
      isDueThisMonthFilterOn: false,
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

  readonly isDueTodayFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueTodayFilterOn
  );

  readonly isDueThisWeekFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueThisWeekFilterOn
  );

  readonly isDueThisMonthFilterOn$: Observable<boolean> = this.select(
    (state) => state.isDueThisMonthFilterOn
  );

  readonly isAnyFilterOn$: Observable<boolean> = this.select(
    this.boardStore.searchTerm$,
    this.boardStore.currentBoardActiveTags$,
    this.isDueTodayFilterOn$,
    this.isDueThisWeekFilterOn$,
    this.isDueThisMonthFilterOn$,
    (searchTerm, activeTags, isDueTodayOn, isDueThisWeekOn, isDueThisMonthOn) =>
      searchTerm !== '' ||
      (activeTags && activeTags.length > 0) ||
      isDueTodayOn ||
      isDueThisWeekOn ||
      isDueThisMonthOn
  );

  readonly filteredTickets$: Observable<Ticket[]> = this.select(
    this.boardStore.currentBoardActiveTags$,
    this.boardStore.searchTerm$,
    this.boardStore.currentBoardTickets$,
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

  readonly setIsDueTodayFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueTodayFilterOn: boolean) => ({
      ...state,
      isDueTodayFilterOn,
    })
  );

  readonly setIsDueThisWeekFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueThisWeekFilterOn: boolean) => ({
      ...state,
      isDueThisWeekFilterOn,
    })
  );

  readonly setIsDueThisMonthFilterOn = this.updater(
    (state: SwimlaneStoreState, isDueThisMonthFilterOn: boolean) => ({
      ...state,
      isDueThisMonthFilterOn,
    })
  );

  readonly turnOffMainFilters = this.updater((state: SwimlaneStoreState) => ({
    ...state,
    isDueTodayFilterOn: false,
    isDueThisWeekFilterOn: false,
    isDueThisMonthFilterOn: false,
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
              this.getLaneMaxPagesUpdateInit();
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
              this.isDueTodayFilterOn$,
              this.isDueThisWeekFilterOn$,
              this.isDueThisMonthFilterOn$
            ),
            filter(([, , currentBoard, , , ,]) => !!currentBoard),
            switchMap(
              ([
                ,
                searchTerm,
                currentBoard,
                isDueTodayFilterOn,
                isDueThisWeekFilterOn,
                isDueThisMonthFilterOn,
              ]) => {
                this.changeCurrentBoardUpdatePagination(currentBoard);

                return this.resetPaginationAndFetchBoards(
                  searchTerm,
                  currentBoard,
                  isDueTodayFilterOn,
                  isDueThisWeekFilterOn,
                  isDueThisMonthFilterOn
                );
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
              this.isDueTodayFilterOn$,
              this.isDueThisWeekFilterOn$,
              this.isDueThisMonthFilterOn$
            ),
            filter(([, , currentBoard, , , ,]) => !!currentBoard),
            switchMap(
              ([
                ,
                searchTerm,
                currentBoard,
                isDueTodayFilterOn,
                isDueThisWeekFilterOn,
                isDueThisMonthFilterOn,
              ]) => {
                this.changeCurrentBoardUpdatePagination(currentBoard);

                return this.resetPaginationAndFetchBoards(
                  searchTerm,
                  currentBoard,
                  isDueTodayFilterOn,
                  isDueThisWeekFilterOn,
                  isDueThisMonthFilterOn
                );
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
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            return this.boardService
              .getBoardsPaginatedWithFilters(
                searchTerm,
                currentBoard?._id,
                isDueTodayFilterOn,
                isDueThisWeekFilterOn,
                isDueThisMonthFilterOn
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
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            return this.resetPaginationAndFetchBoards(
              searchTerm,
              currentBoard,
              isDueTodayFilterOn,
              isDueThisWeekFilterOn,
              isDueThisMonthFilterOn
            );
          }
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
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            activeTags,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            return this.boardService
              .setActiveTags(activeTags, currentBoard._id)
              .pipe(
                switchMap(() => {
                  return this.resetPaginationAndFetchBoards(
                    searchTerm,
                    currentBoard,
                    isDueTodayFilterOn,
                    isDueThisWeekFilterOn,
                    isDueThisMonthFilterOn
                  );
                })
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
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            activeTags,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            return this.boardService
              .setActiveTags(activeTags, currentBoard._id)
              .pipe(
                switchMap(() => {
                  return this.resetPaginationAndFetchBoards(
                    searchTerm,
                    currentBoard,
                    isDueTodayFilterOn,
                    isDueThisWeekFilterOn,
                    isDueThisMonthFilterOn
                  );
                })
              );
          }
        )
      );
    }
  );

  private resetPaginationAndFetchBoards(
    searchTerm: string,
    currentBoard: Board,
    isDueTodayFilterOn: boolean,
    isDueThisWeekFilterOn: boolean,
    isDueThisMonthFilterOn: boolean
  ): Observable<Board[]> {
    this.resetPagination();
    return this.boardService
      .getBoardsPaginatedWithFilters(
        searchTerm,
        currentBoard._id,
        isDueTodayFilterOn,
        isDueThisWeekFilterOn,
        isDueThisMonthFilterOn
      )
      .pipe(
        tap((boards) => {
          this.boardStore.setBoards(boards);
          const currentBoard = (boards as Board[]).find(
            (board) => board.isCurrentBoard
          );
          if (currentBoard?.tickets) {
            this.getLaneMaxPagesFromTickets(currentBoard?.tickets);
          }
        })
      );
  }

  readonly setIsDueTodayFilter = this.effect(
    (setIsDueTodayFilter$: Observable<void>) => {
      return setIsDueTodayFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueTodayFilterOn) {
              this.setIsDueTodayFilterOn(true);
            }
            return this.resetPaginationAndFetchBoards(
              searchTerm,
              currentBoard,
              isDueTodayFilterOn,
              isDueThisWeekFilterOn,
              isDueThisMonthFilterOn
            );
          }
        )
      );
    }
  );

  readonly setIsDueThisWeekFilter = this.effect(
    (setIsDueThisWeekFilter$: Observable<void>) =>
      setIsDueThisWeekFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueThisWeekFilterOn) {
              this.setIsDueThisWeekFilterOn(true);
            }
            return this.resetPaginationAndFetchBoards(
              searchTerm,
              currentBoard,
              isDueTodayFilterOn,
              isDueThisWeekFilterOn,
              isDueThisMonthFilterOn
            );
          }
        )
      )
  );

  readonly setIsDueThisMonthFilter = this.effect(
    (setIsDueThisMonthFilter$: Observable<void>) =>
      setIsDueThisMonthFilter$.pipe(
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.boardStore.currentBoard$,
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            ,
            searchTerm,
            currentBoard,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            this.turnOffMainFilters();

            if (!isDueThisMonthFilterOn) {
              this.setIsDueThisMonthFilterOn(true);
            }
            return this.resetPaginationAndFetchBoards(
              searchTerm,
              currentBoard,
              isDueTodayFilterOn,
              isDueThisWeekFilterOn,
              isDueThisMonthFilterOn
            );
          }
        )
      )
  );

  readonly getMaxPagesForSwimlaneInit = this.effect(
    (getLaneMaxPagesUpdate$: Observable<void>) => {
      return getLaneMaxPagesUpdate$.pipe(
        withLatestFrom(this.boardStore.currentBoard$),
        switchMap(([, currentBoard]) => {
          const maxPagesObservables = swimlaneTitles.map((lane) =>
            this.swimlaneService
              .getMaxPagesForSwimlane(currentBoard, lane)
              .pipe(
                map((maxPages) => ({
                  lane,
                  maxPages: maxPages?.maxPages.toString(),
                }))
              )
          );

          return forkJoin(maxPagesObservables);
        }),
        tap((results: { lane: string; maxPages: string }[]) => {
          results.forEach((result) => {
            this.setLaneMaxPages(result);
          });
        })
      );
    }
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
                  this.swimlaneService.getMaxPagesForSwimlane(
                    currentBoard,
                    lane
                  )
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
        withLatestFrom(this.boardStore.currentBoard$),
        filter(([, currentBoard]) => !!currentBoard),
        switchMap(([, currentBoard]) =>
          currentBoard
            ? swimlaneTitles.map((lane) =>
                this.swimlaneService
                  .getMaxPagesForSwimlane(currentBoard, lane)
                  .pipe(
                    map((maxPages) => ({
                      lane,
                      maxPages: maxPages?.maxPages.toString(),
                    }))
                  )
              )
            : of([])
        ),
        tap((results: { lane: string; maxPages: string }[]) => {
          results.forEach((result) => {
            this.setLaneMaxPages(result);
          });
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
        withLatestFrom(
          this.boardStore.searchTerm$,
          this.isDueTodayFilterOn$,
          this.isDueThisWeekFilterOn$,
          this.isDueThisMonthFilterOn$
        ),
        switchMap(
          ([
            swimlaneTitle,
            searchTerm,
            isDueTodayFilterOn,
            isDueThisWeekFilterOn,
            isDueThisMonthFilterOn,
          ]) => {
            return this.boardService.getBoards().pipe(
              switchMap((boards) => {
                const currentBoard = boards.find(
                  (board) => board.isCurrentBoard
                );

                if (!currentBoard) {
                  return EMPTY;
                }

                let highestTicketNumber = 0;
                for (const ticket of currentBoard.tickets) {
                  const ticketNumber = parseInt(
                    ticket?.ticketNumber?.split('-')[1]
                  );
                  if (
                    !isNaN(ticketNumber) &&
                    ticketNumber > highestTicketNumber
                  ) {
                    highestTicketNumber = ticketNumber;
                  }
                }

                const newTicket: Ticket = {
                  title: 'ticket title',
                  ticketNumber: `MD-${highestTicketNumber + 1}`,
                  description: 'ticket description',
                  tags: [],
                  dueDate: getFormattedDate(new Date()),
                  createdDate: getFormattedDate(new Date()),
                  swimlaneTitle,
                  index: 0,
                };

                return this.swimlaneService
                  .addTicketToCurrentBoard(newTicket)
                  .pipe(
                    switchMap(() =>
                      this.resetPaginationAndFetchBoards(
                        searchTerm,
                        currentBoard,
                        isDueTodayFilterOn,
                        isDueThisWeekFilterOn,
                        isDueThisMonthFilterOn
                      )
                    ),
                    catchError((error) => {
                      console.log(
                        'err addNewTicketToBoard addTicketToCurrentBoard',
                        error
                      );
                      return throwError(error);
                    })
                  );
              })
            );
          }
        ),
        catchError((error) => {
          console.log('err addNewTicketToBoard getBoards', error);
          return throwError(error);
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

  readonly saveUpdatedCurrentTicketField = this.effect(
    (
      saveUpdatedCurrentTicketField$: Observable<{ field: string; value: any }>
    ) =>
      saveUpdatedCurrentTicketField$.pipe(
        tap((vals) =>
          this.boardStore.updateCurrentTicketField({
            field: vals.field,
            value: vals.value,
          })
        ),
        withLatestFrom(this.boardStore.currentTicket$),
        switchMap(([vals, currentTicket]) => {
          return this.swimlaneService
            .updateTicket(currentTicket.ticketNumber, vals.field, vals.value)
            .pipe(
              withLatestFrom(
                this.boardStore.currentBoard$,
                this.boardStore.searchTerm$,
                this.isDueTodayFilterOn$,
                this.isDueThisWeekFilterOn$,
                this.isDueThisMonthFilterOn$
              ),
              switchMap(
                ([
                  ,
                  currentBoard,
                  searchTerm,
                  isDueTodayFilterOn,
                  isDueThisWeekFilterOn,
                  isDueThisMonthFilterOn,
                ]) =>
                  this.resetPaginationAndFetchBoards(
                    searchTerm,
                    currentBoard,
                    isDueTodayFilterOn,
                    isDueThisWeekFilterOn,
                    isDueThisMonthFilterOn
                  )
              ),
              catchError((error) => {
                console.log('err saveUpdatedCurrentTicketField', error);
                return throwError(error);
              })
            );
        })
      )
  );
}
