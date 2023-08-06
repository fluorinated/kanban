import { Ticket } from '../../models/ticket.model';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { EMPTY, Observable, throwError } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Board } from 'src/app/models/board.model';
import { TicketStore } from 'src/app/ticket/store/ticket-store.service';
import {
  dueTodayTickets,
  dueThisWeekTickets,
  dueThisMonthTickets,
  filterTicketsBySearch,
  filterTicketsByMatchingActiveTags,
  sortTickets,
} from 'src/app/utils/board.utils';
import { BoardService } from '../board.service';
import { v4 as uuidv4 } from 'uuid';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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
      currentBoard: null,
      boards: [],
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

  readonly boards$: Observable<Board[]> = this.select((state) => state.boards);

  readonly currentBoard$: Observable<Board> = this.select(
    this.boards$,
    (boards) => boards?.find((board) => board.isCurrentBoard === true)
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

  readonly isEditingTagsOrNoTagsYet$: Observable<boolean> = this.select(
    this.ticketStore.isEditingTags$,
    this.currentTicket$,
    (isEditingTags, currentTicket) =>
      isEditingTags || currentTicket.tags.length === 0
  );

  readonly setBoards = this.updater(
    (state: BoardStoreState, boards: Board[]) => ({
      ...state,
      boards,
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
    (state: BoardStoreState, lane: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedCollapsedLanes = [...board.collapsedLanes, lane];
          return {
            ...board,
            collapsedLanes: updatedCollapsedLanes,
          };
        }
        return board;
      });
      return {
        ...state,
        boards: updatedBoards,
      };
    }
  );

  readonly removeCollapsedLaneToCurrentBoard = this.updater(
    (state: BoardStoreState, lane: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          return {
            ...board,
            collapsedLanes: [
              ...board.collapsedLanes.filter(
                (collapsedLane) => collapsedLane !== lane
              ),
            ],
          };
        }
        return board;
      });
      return {
        ...state,
        boards: updatedBoards,
      };
    }
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
    (state: BoardStoreState, tag: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          return {
            ...board,
            activeTags: [...new Set([...board.activeTags, tag])],
          };
        }
        return board;
      });
      return {
        ...state,
        boards: updatedBoards,
      };
    }
  );

  readonly removeTagFromCurrentBoardActiveTags = this.updater(
    (state: BoardStoreState, tag: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          return {
            ...board,
            activeTags: [...board.activeTags].filter(
              (currentTag) => currentTag !== tag
            ),
          };
        }
        return board;
      });
      return {
        ...state,
        boards: updatedBoards,
      };
    }
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
    (state: BoardStoreState, tag: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedTags = [...new Set([...board.tags, tag])];
          return {
            ...board,
            tags: updatedTags,
          };
        }
        return board;
      });

      return {
        ...state,
        boards: updatedBoards,
      };
    }
  );

  readonly addNewBoardToBoards = this.updater((state: BoardStoreState) => ({
    ...state,
    boards: [
      ...state.boards,
      {
        title: 'title',
        tickets: [],
        tags: [],
        activeTags: [],
        collapsedLanes: [],
        isCurrentBoard: true,
        index: 2,
        _id: uuidv4(),
      },
    ],
  }));

  readonly deleteCurrentBoard = this.updater((state: BoardStoreState) => {
    return {
      ...state,
      boards: state.boards.filter((board) => !board.isCurrentBoard),
    };
  });

  readonly deleteBoard = this.updater(
    (state: BoardStoreState, board: Board) => {
      return {
        ...state,
        boards: state.boards.filter((b) => b !== board),
      };
    }
  );

  readonly deleteTicket = this.updater(
    (state: BoardStoreState, ticketToDelete: Ticket) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.tickets.includes(ticketToDelete)) {
          return {
            ...board,
            tickets: board.tickets.filter(
              (ticket) => ticket !== ticketToDelete
            ),
          };
        }
        return board;
      });

      return {
        ...state,
        boards: updatedBoards,
      };
    }
  );

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

  readonly addTagToCurrentTicketSave = this.effect(
    (addTagToCurrentTicketSave$: Observable<string>) =>
      addTagToCurrentTicketSave$.pipe(
        withLatestFrom(this.boards$, this.currentTicket$),
        tap(([tag]) => this.addTagToCurrentTicket(tag)),
        switchMap(([tag, boards, currentTicket]) => {
          const updatedBoards = boards.map((board) => {
            if (board.isCurrentBoard && board.tickets?.length > 0) {
              const updatedTickets = board.tickets.map((ticket) => {
                if (ticket.ticketNumber === currentTicket.ticketNumber) {
                  return {
                    ...ticket,
                    tags: [...new Set([...ticket.tags, tag])],
                  };
                }
                return ticket;
              });
              return { ...board, tickets: updatedTickets };
            }
            return board;
          });

          return this.boardService.setBoards(updatedBoards).pipe(
            tap(() => this.updateBoards()),
            catchError((error: string) => {
              console.log('err addTagToCurrentTicketSave', error);
              return EMPTY;
            })
          );
        })
      )
  );

  readonly removeTagFromCurrentTicketSave = this.effect(
    (removeTagFromCurrentTicketSave$: Observable<string>) =>
      removeTagFromCurrentTicketSave$.pipe(
        withLatestFrom(this.boards$, this.currentTicket$),
        tap(([tag]) => this.removeTagFromCurrentTicket(tag)),
        switchMap(([tag, boards, currentTicket]) => {
          const updatedBoards = boards.map((board) => {
            if (board.isCurrentBoard && board.tickets?.length > 0) {
              const updatedTickets = board.tickets.map((ticket) => {
                if (ticket.ticketNumber === currentTicket.ticketNumber) {
                  return {
                    ...ticket,
                    tags: ticket.tags.filter((ticketTag) => ticketTag !== tag),
                  };
                }
                return ticket;
              });
              return { ...board, tickets: updatedTickets };
            }
            return board;
          });

          return this.boardService.setBoards(updatedBoards).pipe(
            tap(() => this.updateBoards()),
            catchError((error: string) => {
              console.log('err removeTagFromCurrentTicketSave', error);
              return EMPTY;
            })
          );
        })
      )
  );

  // refresh for new tag
  readonly addNewTagToCurrentBoardTags = this.effect(
    (addNewTagToCurrentBoardTags$: Observable<void>) =>
      addNewTagToCurrentBoardTags$.pipe(
        withLatestFrom(this.ticketStore.newTagName$),
        tap(([, newTagName]: [any, string]) =>
          this.addTagToCurrentBoard(newTagName)
        ),
        withLatestFrom(this.boards$),
        switchMap(([, boards]) => {
          return this.boardService.setBoards(boards).pipe(
            tapResponse(
              () => this.updateBoards(),
              (error: string) =>
                console.log('err addNewTagToCurrentBoardTags', error)
            )
          );
        }),
        tap(() => this.ticketStore.setIsEditingNewTag(false))
      )
  );

  readonly addNewBoardToBoardsUpdate = this.effect(
    (addNewBoardToBoardsUpdate$: Observable<void>) =>
      addNewBoardToBoardsUpdate$.pipe(
        tap(() => this.setAllBoardsCurrentBoardToFalse()),
        tap(() => this.addNewBoardToBoards()),
        withLatestFrom(this.boards$),
        switchMap(([, boards]) => {
          return this.boardService.addNewBoardToBoards(boards).pipe(
            tapResponse(
              (res) => {
                this.updateBoards(res);
                return res;
              },
              (error: string) =>
                console.log('err addNewBoardToBoardsUpdate', error)
            )
          );
        })
      )
  );

  readonly deleteCurrentBoardUpdate = this.effect(
    (deleteCurrentBoardUpdate$: Observable<void>) =>
      deleteCurrentBoardUpdate$.pipe(
        tap(() => this.deleteCurrentBoard()),
        withLatestFrom(this.boards$),
        switchMap(([, boards]) => {
          return this.boardService.deleteCurrentBoard().pipe(
            tapResponse(
              (res) => {
                if (boards[0]) {
                  this.changeCurrentBoard(boards[0]);
                }
                return res;
              },
              (error: string) =>
                console.log('err deleteCurrentBoardUpdate', error)
            )
          );
        })
      )
  );

  readonly deleteBoardUpdate = this.effect(
    (deleteBoardUpdate$: Observable<Board>) =>
      deleteBoardUpdate$.pipe(
        tap((board) => this.deleteBoard(board)),
        withLatestFrom(this.boards$),
        switchMap(([board, boards]) => {
          return this.boardService.deleteBoard(board._id).pipe(
            tapResponse(
              (res) => {
                if (boards[0]) {
                  this.changeCurrentBoard(boards[0]);
                }
                return res;
              },
              (error: string) => console.log('err deleteBoardUpdate', error)
            )
          );
        })
      )
  );

  readonly deleteTicketUpdate = this.effect(
    (deleteTicketUpdate$: Observable<Ticket>) =>
      deleteTicketUpdate$.pipe(
        tap((ticket) => this.deleteTicket(ticket)),
        switchMap((ticket) => {
          return this.boardService.deleteTicket(ticket.ticketNumber).pipe(
            tapResponse(
              (res) => {
                this.setIsTicketOpen(false);
                return res;
              },
              (error: string) => console.log('err deleteTicketUpdate', error)
            )
          );
        })
      )
  );

  readonly updateCurrentBoardTitle = this.effect(
    (updateCurrentBoardTitle$: Observable<string>) =>
      updateCurrentBoardTitle$.pipe(
        tap((title) =>
          this.updateCurrentBoardField({ field: 'title', value: title })
        ),
        withLatestFrom(this.currentBoard$),
        switchMap(([title, currentBoard]) => {
          return this.boardService
            .updateCurrentBoardTitle(title, currentBoard._id)
            .pipe(
              tapResponse(
                (res) => {
                  this.updateBoards(res);
                },
                (error: string) =>
                  console.log('err updateCurrentBoardTitle', error)
              )
            );
        }),
        tap(() => this.setIsEditingCurrentBoardTitle(false))
      )
  );

  readonly updateBoards = this.effect((updateBoards$: Observable<void>) =>
    updateBoards$.pipe(
      switchMap(() => {
        return this.boardService.getBoards().pipe(
          tapResponse(
            (res) => {
              if (res.length > 0) {
                this.setBoards(res);
              }
            },
            (error: string) => console.log('err updateBoards', error)
          )
        );
      })
    )
  );

  readonly setAllBoardsCurrentBoardToFalse = this.effect(
    (setAllBoardsCurrentBoardToFalse$: Observable<void>) =>
      setAllBoardsCurrentBoardToFalse$.pipe(
        withLatestFrom(this.boards$),
        map(([, boards]) => {
          const updatedBoards = boards?.map((board) => ({
            ...board,
            isCurrentBoard: false,
          }));
          return updatedBoards;
        }),
        switchMap((updatedBoards) => {
          return this.boardService.setBoards(updatedBoards).pipe(
            tap(() => this.setBoards(updatedBoards)),
            catchError((error) => {
              console.log('err setAllBoardsCurrentBoardToFalse:', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly changeCurrentBoard = this.effect(
    (changeCurrentBoard$: Observable<Board>) =>
      changeCurrentBoard$.pipe(
        withLatestFrom(this.boards$),
        switchMap(([board, boards]) => {
          const updatedBoards = boards.map((b) => ({
            ...b,
            isCurrentBoard: b._id === board._id,
          }));

          return this.boardService.setBoards(updatedBoards).pipe(
            tap(() => this.setBoards(updatedBoards)),
            catchError((error) => {
              console.log('err changeCurrentBoard:', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly addNewTicketToBoard = this.effect(
    (addNewTicketToBoard$: Observable<string>) =>
      addNewTicketToBoard$.pipe(
        switchMap((swimlaneTitle) => {
          return this.boards$.pipe(
            take(1),
            switchMap((boards) => {
              const currentBoard = boards.find((board) => board.isCurrentBoard);

              if (!currentBoard) {
                return [];
              }

              let highestTicketNumber = 0;
              for (const ticket of currentBoard.tickets) {
                const ticketNumber = parseInt(
                  ticket.ticketNumber.split('-')[1]
                );
                if (
                  !isNaN(ticketNumber) &&
                  ticketNumber > highestTicketNumber
                ) {
                  highestTicketNumber = ticketNumber;
                }
              }

              const swimlaneTickets = currentBoard.tickets.filter(
                (ticket) => ticket.swimlaneTitle === swimlaneTitle
              );

              let swimlaneHighestTicketNumber = 0;
              for (const ticket of swimlaneTickets) {
                const ticketNumber = parseInt(
                  ticket.ticketNumber.split('-')[1]
                );
                if (
                  !isNaN(ticketNumber) &&
                  ticketNumber > swimlaneHighestTicketNumber
                ) {
                  swimlaneHighestTicketNumber = ticketNumber;
                }
              }

              // calc the next ticket number based on the highest ticket number in the specific swimlane
              const nextTicketNumber =
                Math.max(highestTicketNumber, swimlaneHighestTicketNumber) + 1;

              const newTicket: Ticket = {
                title: 'title',
                ticketNumber: `MD-${nextTicketNumber}`,
                description: 'description',
                tags: ['buy'],
                dueDate: 'monday, july 3, 2023',
                createdDate: 'saturday, july 1, 2023',
                swimlaneTitle,
                index: swimlaneTickets.length,
              };

              const updatedTickets = [...currentBoard.tickets, newTicket];

              const updatedBoard: Board = {
                ...currentBoard,
                tickets: updatedTickets,
              };

              const updatedBoards = boards.map((board) =>
                board.isCurrentBoard ? updatedBoard : board
              );

              return this.boardService.setBoards(updatedBoards).pipe(
                tap(() => this.setBoards(updatedBoards)),
                catchError((error) => {
                  console.log('err addNewTicketToBoard:', error);
                  return throwError(error);
                })
              );
            }),
            catchError((error) => {
              console.log('err addNewTicketToBoard:', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly dropUpdateTicketSwimlane = this.effect(
    (dropUpdateTicketSwimlane$: Observable<CdkDragDrop<string[]>>) =>
      dropUpdateTicketSwimlane$.pipe(
        tap((event) => this.boardService.drop(event)),
        switchMap((event) => {
          let title = '';
          switch (event.container.id) {
            case 'cdk-drop-list-0':
              title = 'backlog';
              break;
            case 'cdk-drop-list-1':
              title = 'rdy 2 start';
              break;
            case 'cdk-drop-list-2':
              title = 'blocked';
              break;
            case 'cdk-drop-list-3':
              title = 'in progress';
              break;
            case 'cdk-drop-list-4':
              title = 'done';
              break;
          }
          const ticket = event.container.data[event.currentIndex];
          return this.boardService
            .updateTicketSwimlane(
              title,
              ticket['ticketNumber'],
              event.currentIndex,
              event.previousIndex
            )
            .pipe(
              map(() => event),
              catchError((error) => {
                console.log('err dropUpdateTicketSwimlane:', error);
                return throwError(error);
              })
            );
        })
      )
  );

  readonly saveUpdatedCurrentTicketField = this.effect(
    (
      saveUpdatedCurrentTicketField$: Observable<{ field: string; value: any }>
    ) =>
      saveUpdatedCurrentTicketField$.pipe(
        tap((vals) =>
          this.updateCurrentTicketField({
            field: vals.field,
            value: vals.value,
          })
        ),
        withLatestFrom(this.boards$, this.currentTicket$),
        switchMap(([vals, boards, currentTicket]) => {
          const updatedBoards = boards.map((board) => {
            if (board.isCurrentBoard && board.tickets?.length > 0) {
              const updatedTickets = board.tickets.map((ticket) => {
                if (ticket.ticketNumber === currentTicket.ticketNumber) {
                  return { ...ticket, [vals.field]: vals.value };
                }
                return ticket;
              });
              return { ...board, tickets: updatedTickets };
            }
            return board;
          });

          return this.boardService.setBoards(updatedBoards).pipe(
            switchMap(() => this.boardService.getBoards()),
            tap((res) => this.updateBoards(res)),
            catchError((error) => {
              console.log('err saveUpdatedCurrentTicketField:', error);
              return throwError(error);
            })
          );
        })
      )
  );
}
