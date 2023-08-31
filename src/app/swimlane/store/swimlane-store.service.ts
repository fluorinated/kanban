import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, forkJoin, throwError } from 'rxjs';
import {
  catchError,
  map,
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

  readonly getLaneMaxPagesUpdate = this.effect(
    (getLaneMaxPagesUpdate$: Observable<void>) => {
      return getLaneMaxPagesUpdate$.pipe(
        switchMap(() => {
          const maxPagesObservables = swimlaneTitles.map((lane) =>
            this.swimlaneService.getMaxPagesForSwimlane(lane).pipe(
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

  readonly addNewTicketToSwimlane = this.effect(
    (addNewTicketToBoard$: Observable<string>) =>
      addNewTicketToBoard$.pipe(
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
            return this.boardService.getBoards().pipe(
              switchMap((boards) => {
                let lanePageNumber;
                lanePageNumber = getLanePageNumberFromLane(
                  backlogLanePageNumber,
                  rdy2StartLanePageNumber,
                  blockedLanePageNumber,
                  inProgressLanePageNumber,
                  doneLanePageNumber
                )[swimlaneTitle];

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

                const nextTicketNumber = highestTicketNumber + 1;
                const newIndex = 0;

                const newTicket: Ticket = {
                  title: 'ticket title',
                  ticketNumber: `MD-${nextTicketNumber}`,
                  description: 'ticket description',
                  tags: [],
                  dueDate: getFormattedDate(new Date()),
                  createdDate: getFormattedDate(new Date()),
                  swimlaneTitle,
                  index: newIndex,
                };

                for (let i = 1; i < lanePageNumber; i++) {
                  this.pageBack(swimlaneTitle);
                }

                return this.swimlaneService
                  .addTicketToCurrentBoard(newTicket)
                  .pipe(
                    switchMap(() =>
                      this.swimlaneService.getSwimlaneTicketsAtFirstPage(
                        swimlaneTitle
                      )
                    ),
                    map((updatedSwimlaneTickets) => {
                      const payload = {
                        newTicket,
                        swimlaneTitle,
                        updatedTickets: updatedSwimlaneTickets,
                      };
                      return this.boardStore.updateCurrentBoardSwimlaneTicketsWithNewTicket(
                        payload
                      );
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
            );
          }
        ),
        catchError((error) => {
          console.log('err addNewTicketToBoard getBoards', error);
          return throwError(error);
        })
      )
  );

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
                console.error('err pageBack', error);
                return throwError(error);
              })
            );
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
          let lanePageNumber;
          lanePageNumber = getLanePageNumberFromLane(
            backlogLanePageNumber,
            rdy2StartLanePageNumber,
            blockedLanePageNumber,
            inProgressLanePageNumber,
            doneLanePageNumber
          )[swimlaneTitle];

          const pageNumber = (parseInt(lanePageNumber) + 1).toString();

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
                console.error('err pageForward', error);
                return throwError(error);
              })
            );
        }
      )
    )
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
}
