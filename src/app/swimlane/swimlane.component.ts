import { Component, Input } from '@angular/core';

import { Ticket } from '@models/ticket.model';
import { BoardStore } from '../board/store/board-store.service';
import { SwimlaneStore } from './store/swimlane-store.service';

@Component({
  selector: 'app-swimlane',
  templateUrl: './swimlane.component.html',
  styleUrls: ['./swimlane.component.scss'],
})
export class SwimlaneComponent {
  @Input() title: string;
  @Input() tickets: Ticket[];
  @Input() currentBoardCollapsedLanes: string[];

  constructor(
    private boardStore: BoardStore,
    private swimlaneStore: SwimlaneStore
  ) {}

  addCollapsedLaneToCurrentBoard(lane: string): void {
    this.boardStore.addCollapsedLaneToCurrentBoardSave(lane);
  }

  removeCollapsedLaneToCurrentBoard(lane: string): void {
    this.boardStore.removeCollapsedLaneFromCurrentBoardSave(lane);
  }

  addNewTicket(): void {
    this.swimlaneStore.addNewTicketToSwimlane(this.title);
  }
}
