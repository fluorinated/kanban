import { Component, Input, OnInit } from '@angular/core';

import { Ticket } from '@models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';

@Component({
  selector: 'app-swimlane',
  templateUrl: './swimlane.component.html',
  styleUrls: ['./swimlane.component.scss'],
})
export class SwimlaneComponent implements OnInit {
  @Input() title: string;
  @Input() tickets: Ticket[];
  @Input() currentBoardCollapsedLanes: string[];

  constructor(private boardStore: BoardStore) {}

  ngOnInit(): void {}

  addCollapsedLaneToCurrentBoard(lane: string) {
    this.boardStore.addCollapsedLaneToCurrentBoardSave(lane);
  }

  removeCollapsedLaneToCurrentBoard(lane: string) {
    this.boardStore.removeCollapsedLaneFromCurrentBoardSave(lane);
  }

  addNewTicket() {
    this.boardStore.addNewTicketToBoard(this.title);
  }
}
