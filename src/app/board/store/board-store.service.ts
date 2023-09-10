import { Ticket } from '@models/ticket.model';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, throwError } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Board } from '@models/board.model';
import { TicketStore } from 'src/app/ticket/store/ticket-store.service';
import { BoardService } from '../board.service';

export interface BoardStoreState {
  boards: Board[];
  isTicketOpen: boolean;
  isBoardsListOpen: boolean;
  isFiltersListOpen: boolean;
  currentTicket: Ticket;
  searchTerm: string;
  isEditingCurrentBoardTitle: boolean;
  hasAnsweredYesToDelete: boolean;
  isDeleteModalOpen: boolean;
  itemToDelete: string | Board | Ticket;
}

@Injectable()
export class BoardStore extends ComponentStore<BoardStoreState> {
  constructor(
    private ticketStore: TicketStore,
    private boardService: BoardService
  ) {
    super({
      boards: [],
      isTicketOpen: false,
      isBoardsListOpen: false,
      isFiltersListOpen: false,
      currentTicket: null,
      searchTerm: '',
      isEditingCurrentBoardTitle: false,
      hasAnsweredYesToDelete: false,
      isDeleteModalOpen: false,
      itemToDelete: '',
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

  readonly hasAnsweredYesToDelete$: Observable<boolean> = this.select(
    (state) => state.hasAnsweredYesToDelete
  );

  readonly isDeleteModalOpen$: Observable<boolean> = this.select(
    (state) => state.isDeleteModalOpen
  );

  readonly itemToDelete$: Observable<string | Board | Ticket> = this.select(
    (state) => state.itemToDelete
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

  readonly setItemToDelete = this.updater(
    (state: BoardStoreState, itemToDelete: string | Board | Ticket) => ({
      ...state,
      itemToDelete,
    })
  );

  readonly updateCurrentTicketField = this.updater(
    (state: BoardStoreState, pair: { field: string; value: any }) => ({
      ...state,
      currentTicket: { ...state.currentTicket, [pair?.field]: pair?.value },
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

  readonly removeCollapsedLaneFromCurrentBoard = this.updater(
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

  readonly setCurrentBoardActiveTags = this.updater(
    (state: BoardStoreState, currentBoardActiveTags: Board) => ({
      ...state,
      currentBoardActiveTags,
    })
  );

  readonly setHasAnsweredYesToDelete = this.updater(
    (state: BoardStoreState, hasAnsweredYesToDelete: boolean) => ({
      ...state,
      hasAnsweredYesToDelete,
    })
  );

  readonly setIsDeleteModalOpen = this.updater(
    (state: BoardStoreState, isDeleteModalOpen: boolean) => ({
      ...state,
      isDeleteModalOpen,
    })
  );

  readonly updateCurrentBoardTitle = this.updater(
    (state: BoardStoreState, newTitle: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          return {
            ...board,
            title: newTitle,
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

  readonly deleteCurrentBoardTag = this.updater(
    (state: BoardStoreState, tag: string) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedTags = board.tags.filter(
            (existingTag) => existingTag !== tag
          );
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

  readonly addTagToCurrentTicket = this.updater(
    (state: BoardStoreState, tag: string) => ({
      ...state,
      currentTicket: {
        ...state.currentTicket,
        tags: [...new Set([...state.currentTicket.tags, tag])],
      },
    })
  );

  readonly addTagToCurrentTicketWithinBoards = this.updater(
    (
      state: BoardStoreState,
      { ticketNumber, tag }: { ticketNumber: string; tag: string }
    ) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedTickets = board.tickets.map((ticket) => {
            if (ticket.ticketNumber === ticketNumber) {
              return {
                ...ticket,
                tags: [...new Set([...ticket.tags, tag])],
              };
            }
            return ticket;
          });
          return {
            ...board,
            tickets: updatedTickets,
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

  readonly removeTagFromCurrentTicketWithinBoards = this.updater(
    (
      state: BoardStoreState,
      {
        ticketNumber,
        tagToRemove,
      }: { ticketNumber: string; tagToRemove: string }
    ) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedTickets = board.tickets.map((ticket) => {
            if (ticket.ticketNumber === ticketNumber) {
              const updatedTags = ticket.tags.filter(
                (tag) => tag !== tagToRemove
              );
              return {
                ...ticket,
                tags: updatedTags,
              };
            }
            return ticket;
          });
          return {
            ...board,
            tickets: updatedTickets,
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

  readonly setCurrentBoardSwimlaneTickets = this.updater(
    (
      state: BoardStoreState,
      update: { swimlaneTitle: string; newSwimlaneTickets: Ticket[] }
    ) => {
      // remove swimlaneTitle's tickets from the board and add newSwimlaneTickets
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard && board.tickets) {
          const updatedTickets = board.tickets.filter(
            (ticket) => ticket.swimlaneTitle !== update.swimlaneTitle
          );

          return {
            ...board,
            tickets: [...updatedTickets, ...update.newSwimlaneTickets],
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

  readonly updateCurrentBoardSwimlaneTicketsWithNewTicket = this.updater(
    (
      state: BoardStoreState,
      payload: {
        newTicket: Ticket;
        swimlaneTitle: string;
        updatedTickets: Ticket[];
      }
    ) => {
      const updatedBoards = state.boards.map((board) => {
        if (board.isCurrentBoard) {
          const updatedTickets = board.tickets.map((ticket) =>
            ticket.swimlaneTitle === payload.swimlaneTitle
              ? {
                  ...ticket,
                  ...payload.updatedTickets.find(
                    (updatedTicket) =>
                      updatedTicket.ticketNumber === ticket.ticketNumber
                  ),
                }
              : ticket
          );

          // find the index of the topmost ticket in the swimlane
          const topmostIndex = updatedTickets.reduce(
            (minIndex, ticket) =>
              ticket.swimlaneTitle === payload.swimlaneTitle &&
              ticket.index < minIndex
                ? ticket.index
                : minIndex,
            Infinity
          );

          payload.newTicket.index = topmostIndex - 1;

          updatedTickets.unshift(payload.newTicket);

          return {
            ...board,
            tickets: updatedTickets,
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

  readonly addNewTagToCurrentBoardTags = this.effect(
    (addNewTagToCurrentBoardTags$: Observable<void>) =>
      addNewTagToCurrentBoardTags$.pipe(
        withLatestFrom(this.ticketStore.newTagName$),
        tap(([, newTagName]) => this.addTagToCurrentBoard(newTagName)),
        switchMap(([, newTagName]) => {
          return this.boardService.addTagToCurrentBoard(newTagName).pipe(
            catchError((error: string) => {
              console.log('err addNewTagToCurrentBoardTags', error);
              return throwError(error);
            })
          );
        }),
        tap(() => this.ticketStore.setIsEditingNewTag(false))
      )
  );

  readonly deleteCurrentBoardTagUpdate = this.effect(
    (deleteCurrentBoardTag$: Observable<string>) =>
      deleteCurrentBoardTag$.pipe(
        tap((tag) => this.deleteCurrentBoardTag(tag)),
        switchMap((tag) => {
          return this.boardService.deleteCurrentBoardTag(tag).pipe(
            catchError((error: string) => {
              console.log('err deleteCurrentBoardTagUpdate', error);
              return throwError(error);
            })
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
            tap(() => this.setIsTicketOpen(false)),
            catchError((error: string) => {
              console.log('err deleteTicketUpdate', error);
              return throwError(error);
            })
          );
        })
      )
  );

  readonly addCollapsedLaneToCurrentBoardSave = this.effect(
    (addCollapsedLaneToCurrentBoardSave$: Observable<string>) =>
      addCollapsedLaneToCurrentBoardSave$.pipe(
        tap((lane) => this.addCollapsedLaneToCurrentBoard(lane)),
        switchMap((lane) => {
          return this.boardService
            .addCollapsedLaneToCurrentBoardSave(lane)
            .pipe(
              catchError((error: string) => {
                console.log('err addCollapsedLaneToCurrentBoardSave', error);
                return throwError(error);
              })
            );
        })
      )
  );

  readonly removeCollapsedLaneFromCurrentBoardSave = this.effect(
    (removeCollapsedLaneFromCurrentBoardSave$: Observable<string>) =>
      removeCollapsedLaneFromCurrentBoardSave$.pipe(
        tap((lane) => this.removeCollapsedLaneFromCurrentBoard(lane)),
        switchMap((lane) => {
          return this.boardService
            .removeCollapsedLaneFromCurrentBoardSave(lane)
            .pipe(
              catchError((error: string) => {
                console.log(
                  'err removeCollapsedLaneFromCurrentBoardSave',
                  error
                );
                return throwError(error);
              })
            );
        })
      )
  );

  readonly updateCurrentBoardTitleSave = this.effect(
    (updateCurrentBoardTitle$: Observable<string>) =>
      updateCurrentBoardTitle$.pipe(
        withLatestFrom(this.currentBoard$),
        switchMap(([title, currentBoard]) => {
          this.updateCurrentBoardTitle(title);
          return this.boardService
            .updateCurrentBoardTitle(title, currentBoard._id)
            .pipe(
              catchError((error: string) => {
                console.log('err updateCurrentBoardTitle', error);
                return throwError(error);
              })
            );
        }),
        tap(() => this.setIsEditingCurrentBoardTitle(false))
      )
  );

  readonly addTagToCurrentTicketSave = this.effect(
    (addTagToCurrentTicketSave$: Observable<string>) =>
      addTagToCurrentTicketSave$.pipe(
        withLatestFrom(this.currentTicket$),
        tap(([tag]) => this.addTagToCurrentTicket(tag)),
        tap(([tag, currentTicket]) =>
          this.addTagToCurrentTicketWithinBoards({
            tag,
            ticketNumber: currentTicket.ticketNumber,
          })
        ),
        switchMap(([tag, currentTicket]) => {
          return this.boardService
            .addTagToCurrentTicket(currentTicket.ticketNumber, tag)
            .pipe(
              catchError((error: string) => {
                console.log('err addTagToCurrentTicketSave', error);
                return throwError(error);
              })
            );
        })
      )
  );

  readonly removeTagFromCurrentTicketSave = this.effect(
    (removeTagFromCurrentTicketSave$: Observable<string>) =>
      removeTagFromCurrentTicketSave$.pipe(
        withLatestFrom(this.currentTicket$),
        tap(([tag]) => this.removeTagFromCurrentTicket(tag)),
        tap(([tag, currentTicket]) =>
          this.removeTagFromCurrentTicketWithinBoards({
            ticketNumber: currentTicket.ticketNumber,
            tagToRemove: tag,
          })
        ),
        switchMap(([tag, currentTicket]) => {
          return this.boardService
            .removeTagFromCurrentTicket(currentTicket.ticketNumber, tag)
            .pipe(
              catchError((error: string) => {
                console.log('err removeTagFromCurrentTicketSave', error);
                return throwError(error);
              })
            );
        })
      )
  );
}
