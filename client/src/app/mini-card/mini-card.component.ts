import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Ticket } from "../models/ticket.model";

@Component({
  selector: "app-mini-card",
  templateUrl: "./mini-card.component.html",
  styleUrls: ["./mini-card.component.scss"],
})
export class MiniCardComponent implements OnInit {
  @Input() ticket: Ticket;
  @Output() ticketClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  openTicket(): void {
    this.ticketClicked.emit();
  }
}
