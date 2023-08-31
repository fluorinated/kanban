import { Ticket } from '@models/ticket.model';
import * as moment from 'moment';

export const swimlaneTitles = [
  'backlog',
  'rdy 2 start',
  'blocked',
  'in progress',
  'done',
];

export const sortTickets = (tickets: Ticket[]) =>
  tickets?.sort((a, b) => a.index - b.index);

export const filterTicketsBySearch = (
  searchTerm: string,
  currentBoardTickets: Ticket[]
) => {
  currentBoardTickets = currentBoardTickets?.filter((ticket) => {
    if (searchTerm !== '') {
      return (
        (ticket?.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket?.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (ticket?.ticketNumber).toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return ticket;
    }
  });
  return currentBoardTickets;
};

export const filterTicketsByMatchingActiveTags = (
  activeTags: string[],
  currentBoardTickets: Ticket[]
) => {
  currentBoardTickets = currentBoardTickets?.filter((ticket) => {
    return ticket?.tags.some((tag) => activeTags.includes(tag));
  });
  return currentBoardTickets;
};

export const dueTodayTickets = (filteredTickets: Ticket[]) => {
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, '0');
  let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  let currentYear = date.getFullYear();

  // DD-MM-YYYY
  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = new Date(ticket.dueDate);
    let ticketCurrentDay = String(ticketDueDate.getDate()).padStart(2, '0');
    let ticketCurrentMonth = String(ticketDueDate.getMonth() + 1).padStart(
      2,
      '0'
    );
    let ticketCurrentYear = ticketDueDate.getFullYear();
    let ticketCurrentDate = `${ticketCurrentDay}-${ticketCurrentMonth}-${ticketCurrentYear}`;

    return currentDate === ticketCurrentDate;
  });
  return filteredTickets;
};

export const dueThisWeekTickets = (filteredTickets: Ticket[]) => {
  var startOfWeek = moment().startOf('week');
  var endOfWeek = moment().endOf('week');

  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = new Date(ticket.dueDate);
    return moment(ticketDueDate).isBetween(startOfWeek, endOfWeek, null, '[]');
  });

  return filteredTickets;
};

export const dueThisMonthTickets = (filteredTickets: Ticket[]) => {
  var startOfMonth = moment().startOf('month');
  var endOfMonth = moment().endOf('month');

  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = new Date(ticket.dueDate);
    return moment(ticketDueDate).isBetween(
      startOfMonth,
      endOfMonth,
      null,
      '[]'
    );
  });

  return filteredTickets;
};

export const getLanePageNumberTitleFromLane = {
  'backlog': 'backlogLanePageNumber',
  'rdy 2 start': 'rdy2StartLanePageNumber',
  'blocked': 'blockedLanePageNumber',
  'in progress': 'inProgressLanePageNumber',
  'done': 'doneLanePageNumber',
};

export const getLanePageNumberFromLane = (
  backlogLanePageNumber: string,
  rdy2StartLanePageNumber,
  blockedLanePageNumber,
  inProgressLanePageNumber,
  doneLanePageNumber
) => {
  {
    return {
      'backlog': backlogLanePageNumber,
      'rdy 2 start': rdy2StartLanePageNumber,
      'blocked': blockedLanePageNumber,
      'in progress': inProgressLanePageNumber,
      'done': doneLanePageNumber,
    };
  }
};
