import { Ticket } from './ticket.model';

export interface Board {
  _id: string;
  title: string;
  tickets: Ticket[];
  tags: string[];
  activeTags: string[];
  index: number;
  collapsedLanes: string[];
  isCurrentBoard: boolean;
}
