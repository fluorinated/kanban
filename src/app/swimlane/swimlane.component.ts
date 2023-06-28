import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Ticket } from "../models/ticket.model";

@Component({
  selector: "app-swimlane",
  templateUrl: "./swimlane.component.html",
  styleUrls: ["./swimlane.component.scss"],
})
export class SwimlaneComponent implements OnInit {
  @Input() title: string;
  @Input() tickets: Ticket[];

  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  isCollapsed: boolean = false;

  constructor() {}

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log("event", event.item.dropContainer.data);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log("event", event.item.dropContainer.data);
    }
  }

  ngOnInit(): void {
    console.log("isCollapsed", this.isCollapsed);
  }

  toggleCollapseLane() {
    this.isCollapsed = !this.isCollapsed;
  }

  openTicket(ticket: Ticket) {
    this.ticketClicked.emit(ticket);
  }
}
