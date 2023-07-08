import { Ticket } from './ticket.model';

export interface Board {
  title: string;
  tickets: Ticket[];
  tags: string[];
  activeTags: string[];
  index: number;
  collapsedLanes: string[];
}
