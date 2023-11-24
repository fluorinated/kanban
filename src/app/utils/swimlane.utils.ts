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

export const getTodayTickets = (filteredTickets: Ticket[], isDue: boolean) => {
  const date = moment();

  let currentDay = String(date.date()).padStart(2, '0');
  let currentMonth = String(date.month() + 1).padStart(2, '0');
  let currentYear = date.year();

  // DD-MM-YYYY
  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;
  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = moment(
      isDue ? ticket.dueDate : ticket.createdDate,
      'dddd, MMMM D, YYYY'
    );
    let ticketCurrentDay = String(ticketDueDate.date()).padStart(2, '0');
    let ticketCurrentMonth = String(ticketDueDate.month() + 1).padStart(2, '0');
    let ticketCurrentYear = ticketDueDate.year();
    let ticketCurrentDate = `${ticketCurrentDay}-${ticketCurrentMonth}-${ticketCurrentYear}`;

    return currentDate === ticketCurrentDate;
  });
  return filteredTickets;
};

export const getThisWeekTickets = (
  filteredTickets: Ticket[],
  isDue: boolean
) => {
  var startOfWeek = moment().startOf('week');
  var endOfWeek = moment().endOf('week');

  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = moment(
      isDue ? ticket.dueDate : ticket.createdDate,
      'dddd, MMMM D, YYYY'
    );
    return moment(ticketDueDate, 'dddd, MMMM D, YYYY').isBetween(
      startOfWeek,
      endOfWeek,
      null,
      '[]'
    );
  });

  return filteredTickets;
};

export const getThisMonthTickets = (
  filteredTickets: Ticket[],
  isDue: boolean
) => {
  var startOfMonth = moment().startOf('month');
  var endOfMonth = moment().endOf('month');

  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = moment(
      isDue ? ticket.dueDate : ticket.createdDate,
      'dddd, MMMM D, YYYY'
    );
    return moment(ticketDueDate, 'dddd, MMMM D, YYYY').isBetween(
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
