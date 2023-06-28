import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";

import { Ticket } from "../models/ticket.model";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent implements OnInit {
  swimlaneTitles = ["backlog", "rdy 2 start", "blocked", "in progress", "done"];
  tickets: Ticket[] = [
    {
      title: "craft crochet pouches",
      ticketNumber: "MD-619",
      description: "* watch youtube videos * practice basic crocheting methods",
      tags: ["buy", "dress-up", "fun"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "backlog",
      index: 0,
    },
    {
      title: "learn how to crochet",
      ticketNumber: "MD-620",
      description: "* practice every single day and don't stop",
      tags: ["buy", "dress-up", "fun"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "backlog",
      index: 1,
    },
    {
      title: "mop the entire house",
      ticketNumber: "MD-621",
      description: "* fill bucket with hot water and go to town",
      tags: ["buy", "chore", "home-improvement"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "in progress",
      index: 0,
    },
    {
      title: "pack clothes for travel to indianapolis",
      ticketNumber: "MD-622",
      description: "* pack away clothes",
      tags: ["chore", "fun"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "rdy 2 start",
      index: 0,
    },
    {
      title: "pack clothes for travel to indianapolis",
      ticketNumber: "MD-623",
      description: "* pack away clothes",
      tags: ["chore", "fun"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "blocked",
      index: 0,
    },
    {
      title: "pick out outfits for the upcoming show",
      ticketNumber: "MD-624",
      description: "* pack away clothes",
      tags: ["chore", "fun"],
      dueDate: "friday, may 26, 2023",
      createdDate: "tuesday, may 16, 2023",
      swimlaneTitle: "rdy 2 start",
      index: 1,
    },
  ];
  isTicketOpen: boolean = false;
  currentTicket: Ticket;
  backlogTickets = this.tickets.filter(
    (ticket) => ticket.swimlaneTitle === "backlog"
  );
  rdy2StartTickets = this.tickets.filter(
    (ticket) => ticket.swimlaneTitle === "rdy 2 start"
  );

  todo = [
    "Get to work",
    "Pick up groceries",
    "Go home",
    "Fall asleep",
    "Get up",
    "Brush teeth",
    "Take a shower",
    "Check e-mail",
    "Walk dog",
  ];

  done = [];

  constructor() {}

  ngOnInit(): void {}

  getTicketsForSwimlane(swimlaneTitle: string) {
    let newTickets = this.tickets.filter(
      (ticket) => ticket.swimlaneTitle === swimlaneTitle
    );
    return newTickets;
  }

  openTicket($event): void {
    this.isTicketOpen = true;
    this.currentTicket = $event;
  }

  closeTicket(): void {
    this.isTicketOpen = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log("Transfering item to new container");
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
