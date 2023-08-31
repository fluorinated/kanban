import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Ticket } from '@models/ticket.model';

@Component({
  selector: 'app-mini-card',
  templateUrl: './mini-card.component.html',
  styleUrls: ['./mini-card.component.scss'],
})
export class MiniCardComponent {
  @Input() ticket: Ticket;
  @Output() ticketClicked: EventEmitter<void> = new EventEmitter<void>();

  openTicket(): void {
    this.ticketClicked.emit();
  }
}
