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
  tags = [
    'buy',
    'dress up',
    'fun',
    'home improvement',
    'chore',
    'health',
    'finance',
    'errands',
    'fitness',
    'creative',
    'self-care',
    'important',
    'urgent',
  ];

  currentBoard$: Observable<Board>;
  boards$: Observable<Board[]>;
  backlogTickets$: Observable<Ticket[]>;
  rdy2StartTickets$: Observable<Ticket[]>;
  blockedTickets$: Observable<Ticket[]>;
  inProgressTickets$: Observable<Ticket[]>;
  doneTickets$: Observable<Ticket[]>;
  isTicketOpen$: Observable<boolean>;
  isBoardsListOpen$: Observable<boolean>;
  currentTicket$: Observable<Ticket>;
  isEditingCurrentBoardTitle$: Observable<boolean>;

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
    this.currentTicket$ = this.boardStore.currentTicket$;
    this.isEditingCurrentBoardTitle$ =
      this.boardStore.isEditingCurrentBoardTitle$;
  }

  changeCurrentBoard(board: Board) {
    this.boardStore.setCurrentBoard(board);
  }

  ngOnInit(): void {}

  openTicket($event): void {
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

  saveCurrentBoardTitle($event) {
    this.boardStore.setIsEditingCurrentBoardTitle(false);
    this.boardStore.updateCurrentBoardField({ field: 'title', value: $event });
  }

  editBoardTitle() {
    this.boardStore.setIsEditingCurrentBoardTitle(true);
  }

  addNewBoardToBoards() {
    this.boardStore.addNewBoardToBoards();
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
}
