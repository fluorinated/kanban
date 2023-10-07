import { Component, OnInit } from '@angular/core';
import { Ticket } from '@models/ticket.model';
import { Board } from '@models/board.model';
import { BoardStore } from './store/board-store.service';
import { Observable } from 'rxjs';
import { SwimlaneStore } from '../swimlane/store/swimlane-store.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  currentBoard$: Observable<Board>;
  boards$: Observable<Board[]>;
  backlogTickets$: Observable<Ticket[]>;
  rdy2StartTickets$: Observable<Ticket[]>;
  blockedTickets$: Observable<Ticket[]>;
  inProgressTickets$: Observable<Ticket[]>;
  doneTickets$: Observable<Ticket[]>;
  isTicketOpen$: Observable<boolean>;
  isBoardsListOpen$: Observable<boolean>;
  isFiltersListOpen$: Observable<boolean>;
  isDueFilterOn$: Observable<boolean>;
  isDueCreatedTodayFilterOn$: Observable<boolean>;
  isDueCreatedThisWeekFilterOn$: Observable<boolean>;
  isDueCreatedThisMonthFilterOn$: Observable<boolean>;
  isAnyFilterOn$: Observable<boolean>;
  currentTicket$: Observable<Ticket>;
  isEditingCurrentBoardTitle$: Observable<boolean>;
  currentBoardCollapsedLanes$: Observable<string[]>;

  isDueSliderOn: boolean = true;

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {
    this.currentBoard$ = this.boardStore.currentBoard$;
    this.boards$ = this.boardStore.boards$;
    this.backlogTickets$ = this.swimlaneStore.backlogTickets$;
    this.rdy2StartTickets$ = this.swimlaneStore.rdy2StartTickets$;
    this.blockedTickets$ = this.swimlaneStore.blockedTickets$;
    this.inProgressTickets$ = this.swimlaneStore.inProgressTickets$;
    this.doneTickets$ = this.swimlaneStore.doneTickets$;
    this.isTicketOpen$ = this.boardStore.isTicketOpen$;
    this.isBoardsListOpen$ = this.boardStore.isBoardsListOpen$;
    this.isFiltersListOpen$ = this.boardStore.isFiltersListOpen$;
    this.isDueCreatedTodayFilterOn$ =
      this.swimlaneStore.isDueCreatedTodayFilterOn$;
    this.isDueCreatedThisWeekFilterOn$ =
      this.swimlaneStore.isDueCreatedThisWeekFilterOn$;
    this.isDueCreatedThisMonthFilterOn$ =
      this.swimlaneStore.isDueCreatedThisMonthFilterOn$;
    this.isAnyFilterOn$ = this.swimlaneStore.isAnyFilterOn$;
    this.currentTicket$ = this.boardStore.currentTicket$;
    this.isEditingCurrentBoardTitle$ =
      this.boardStore.isEditingCurrentBoardTitle$;
    this.currentBoardCollapsedLanes$ =
      this.boardStore.currentBoardCollapsedLanes$;
    this.isDueFilterOn$ = this.swimlaneStore.isDueFilterOn$;
  }

  changeCurrentBoard(board: Board): void {
    this.swimlaneStore.changeCurrentBoardUpdatePagination(board);
    this.closeBoards();
  }

  ngOnInit(): void {
    this.swimlaneStore.getBoardsPaginatedWithFiltersInit();
  }

  openTicket($event: Ticket): void {
    this.boardStore.setIsFiltersListOpen(false);
    this.boardStore.setIsTicketOpen(true);
    this.boardStore.setCurrentTicket($event);
  }

  closeTicket(): void {
    this.boardStore.setIsTicketOpen(false);
  }

  openBoards(): void {
    this.boardStore.setIsBoardsListOpen(true);
  }

  closeBoards(): void {
    this.boardStore.setIsBoardsListOpen(false);
  }

  openFilters(): void {
    this.boardStore.setIsTicketOpen(false);
    this.boardStore.setIsFiltersListOpen(true);
  }

  closeFilters(): void {
    this.boardStore.setIsFiltersListOpen(false);
  }

  saveCurrentBoardTitle($event: string) {
    this.boardStore.updateCurrentBoardTitleSave($event);
  }

  editBoardTitle(): void {
    this.boardStore.setIsEditingCurrentBoardTitle(true);
  }

  addNewBoardToBoards(): void {
    this.swimlaneStore.addNewBoardToBoardsUpdate();
  }

  deleteBoard($event: Board): void {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete($event);
  }

  setIsDueCreatedTodayFilterOn(): void {
    this.swimlaneStore.setIsDueCreatedTodayFilter();
  }

  setIsDueCreatedThisWeekFilterOn(): void {
    this.swimlaneStore.setIsDueCreatedThisWeekFilter();
  }

  setIsDueCreatedThisMonthFilterOn(): void {
    this.swimlaneStore.setIsDueCreatedThisMonthFilter();
  }

  handleDeleteCurrentBoard(): void {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete('currentBoard');
  }
}
