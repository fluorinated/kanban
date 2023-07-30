export interface Ticket {
  title: string;
  ticketNumber: string; // like _id in board
  description: string;
  tags: string[];
  dueDate: string;
  createdDate: string;
  swimlaneTitle: string; // default is backlog
  index: number;
}
