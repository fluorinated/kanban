import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Ticket } from '../models/ticket.model';

@Component({
  selector: 'app-swimlane',
  templateUrl: './swimlane.component.html',
  styleUrls: ['./swimlane.component.scss'],
})
export class SwimlaneComponent implements OnInit {
  @Input() title: string;
  @Input() tickets: Ticket[];

  @Output() ticketClicked: EventEmitter<Ticket> = new EventEmitter<Ticket>();

  isCollapsed: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('isCollapsed', this.isCollapsed);
  }

  toggleCollapseLane() {
    this.isCollapsed = !this.isCollapsed;
  }

  openTicket(ticket: Ticket) {
    this.ticketClicked.emit(ticket);
  }
}
