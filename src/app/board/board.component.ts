import { Component, OnInit } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { Board } from '../models/board.model';
import { BoardStore } from './store/board-store.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  swimlaneTitles = ['backlog', 'rdy 2 start', 'blocked', 'in progress', 'done'];

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
  isDueTodayFilterOn$: Observable<boolean>;
  isDueThisWeekFilterOn$: Observable<boolean>;
  isDueThisMonthFilterOn$: Observable<boolean>;
  currentTicket$: Observable<Ticket>;
  isEditingCurrentBoardTitle$: Observable<boolean>;
  currentBoardCollapsedLanes$: Observable<string[]>;

  constructor(private boardStore: BoardStore) {
    this.currentBoard$ = this.boardStore.currentBoard$;
    this.boards$ = this.boardStore.boards$;
    this.backlogTickets$ = this.boardStore.backlogTickets$;
    this.rdy2StartTickets$ = this.boardStore.rdy2StartTickets$;
    this.blockedTickets$ = this.boardStore.blockedTickets$;
    this.inProgressTickets$ = this.boardStore.inProgressTickets$;
    this.doneTickets$ = this.boardStore.doneTickets$;
    this.isTicketOpen$ = this.boardStore.isTicketOpen$;
    this.isBoardsListOpen$ = this.boardStore.isBoardsListOpen$;
    this.isFiltersListOpen$ = this.boardStore.isFiltersListOpen$;
    this.isDueTodayFilterOn$ = this.boardStore.isDueTodayFilterOn$;
    this.isDueThisWeekFilterOn$ = this.boardStore.isDueThisWeekFilterOn$;
    this.isDueThisMonthFilterOn$ = this.boardStore.isDueThisMonthFilterOn$;
    this.currentTicket$ = this.boardStore.currentTicket$;
    this.isEditingCurrentBoardTitle$ =
      this.boardStore.isEditingCurrentBoardTitle$;
    this.currentBoardCollapsedLanes$ =
      this.boardStore.currentBoardCollapsedLanes$;
  }

  changeCurrentBoard(board: Board) {
    this.boardStore.changeCurrentBoard(board);
  }

  ngOnInit(): void {
    const data = {
      title: 'test',
      description: 'desc test',
      published: false,
    };
    this.boardStore.updateBoards();
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
    this.boardStore.updateCurrentBoardTitle($event);
  }

  editBoardTitle() {
    this.boardStore.setIsEditingCurrentBoardTitle(true);
  }

  addNewBoardToBoards() {
    this.boardStore.addNewBoardToBoardsUpdate();
  }

  deleteBoard($event: Board) {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete($event);
  }

  setIsDueTodayFilterOn() {
    this.boardStore.setIsDueTodayFilter();
  }

  setIsDueThisWeekFilterOn() {
    this.boardStore.setIsDueThisWeekFilter();
  }

  setIsDueThisMonthFilterOn() {
    this.boardStore.setIsDueThisMonthFilter();
  }

  handleDeleteCurrentBoard() {
    this.boardStore.setIsDeleteModalOpen(true);
    this.boardStore.setItemToDelete('currentBoard');
  }
}
