export interface Ticket {
  title: string;
  ticketNumber: string;
  description: string;
  tags: string[];
  dueDate: string;
  createdDate: string;
  swimlaneTitle: string; // default is backlog
  index: number;
}
