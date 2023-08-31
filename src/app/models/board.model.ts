import { Ticket } from '@models/ticket.model';

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
