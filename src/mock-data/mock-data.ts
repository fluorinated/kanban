import { Board } from 'src/app/models/board.model';
import { Ticket } from 'src/app/models/ticket.model';

export const mockTickets: Ticket[] = [
  {
    title: 'craft crochet pouches',
    ticketNumber: 'MD-619',
    description: '* watch youtube videos * practice basic crocheting methods',
    tags: ['buy', 'dress-up', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'backlog',
    index: 0,
  },
  {
    title: 'learn how to crochet',
    ticketNumber: 'MD-620',
    description: "* practice every single day and don't stop",
    tags: ['buy', 'dress-up', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'backlog',
    index: 1,
  },
  {
    title: 'mop the entire house',
    ticketNumber: 'MD-621',
    description: '* fill bucket with hot water and go to town',
    tags: ['buy', 'chore', 'home-improvement'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'in progress',
    index: 0,
  },
  {
    title: 'pack clothes for travel to indianapolis',
    ticketNumber: 'MD-622',
    description: '* pack away clothes',
    tags: ['chore', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'rdy 2 start',
    index: 0,
  },
  {
    title: 'work on recipmes',
    ticketNumber: 'MD-623',
    description: '* pack away clothes',
    tags: ['chore', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'blocked',
    index: 0,
  },
  {
    title: 'pick out outfits for the upcoming show',
    ticketNumber: 'MD-624',
    description: '* pack away clothes',
    tags: ['chore', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'done',
    index: 0,
  },
];

export const mockTicketsTwo: Ticket[] = [
  {
    title: 'make puttanesca',
    ticketNumber: 'MD-619',
    description: '* grab the red wine * have a good time',
    tags: ['buy', 'dress-up', 'fun'],
    dueDate: 'friday, may 26, 2023',
    createdDate: 'tuesday, may 16, 2023',
    swimlaneTitle: 'backlog',
    index: 0,
  },
];

export const mockBoard: Board = {
  title: 'kanban 1',
  tickets: mockTickets,
  tags: [
    'buy',
    'dress up',
    'fun',
    'home improvement',
    'chore',
    'health',
    'finance',
    'errands',
    'fitness',
    'creative',
    'self-care',
    'important',
    'urgent',
  ],
  activeTags: [
    'buy',
    'dress up',
    'fun',
    'home improvement',
    'chore',
    'health',
    'finance',
    'errands',
    'fitness',
  ],
  index: 0,
};

export const mockBoardTwo: Board = {
  title: 'kb 2',
  tickets: mockTicketsTwo,
  tags: ['rittenhouse', 'whole foods', 'acme', 'aldi'],
  activeTags: ['rittenhouse', 'acme', 'aldi'],
  index: 1,
};
