import { Component, Input, OnInit } from '@angular/core';

import { Ticket } from '@models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { SwimlaneStore } from './store/swimlane-store.service';

@Component({
  selector: 'app-swimlane',
  templateUrl: './swimlane.component.html',
  styleUrls: ['./swimlane.component.scss'],
})
export class SwimlaneComponent implements OnInit {
  @Input() title: string;
  @Input() tickets: Ticket[];
  @Input() currentBoardCollapsedLanes: string[];

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {}

  ngOnInit(): void {}

  addCollapsedLaneToCurrentBoard(lane: string) {
    this.boardStore.addCollapsedLaneToCurrentBoardSave(lane);
  }

  removeCollapsedLaneToCurrentBoard(lane: string) {
    this.boardStore.removeCollapsedLaneFromCurrentBoardSave(lane);
  }

  addNewTicket() {
    this.swimlaneStore.addNewTicketToSwimlane(this.title);
  }
}
