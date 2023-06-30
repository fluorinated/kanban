import { Ticket } from './ticket.model';

export interface Board {
  title: string;
  tickets: Ticket[];
  index: number;
}
