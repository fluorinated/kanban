import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Ticket } from "../models/ticket.model";

@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.scss"],
})
export class TicketComponent implements OnInit {
  @Input() ticket: Ticket;

  @Output() closeButtonClicked: EventEmitter<void> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  closeTicket() {
    this.closeButtonClicked.emit();
  }
}
