import { Component, Input, OnInit } from '@angular/core';

import { Ticket } from '../models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';

@Component({
  selector: 'app-swimlane',
  templateUrl: './swimlane.component.html',
  styleUrls: ['./swimlane.component.scss'],
})
export class SwimlaneComponent implements OnInit {
  @Input() title: string;
  @Input() tickets: Ticket[];

  isCollapsed: boolean = false;

  constructor(private boardStore: BoardStore) {}

  ngOnInit(): void {}

  toggleCollapseLane() {
    this.isCollapsed = !this.isCollapsed;
  }

  addNewTicket() {
    this.boardStore.addNewTicketToBoard(this.title);
  }
}
