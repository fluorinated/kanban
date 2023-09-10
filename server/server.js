var express = require('express');
const cors = require('cors');
const app = express();
const { v4: uuidv4 } = require('uuid');

var corsOptions = {
  origin: [
    'https://kanban-service-heeh.onrender.com',
    'http://localhost:8080',
    'http://localhost:4200',
    'https://fluorinated.github.io',
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('.'));

const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://m2015dominguez:kbdbpw2023md@cluster0.9dhxiiv.mongodb.net/kanban?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const SWIMLANE_TITLES = [
  'backlog',
  'rdy 2 start',
  'in progress',
  'blocked',
  'done',
];

client.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(100);
  }
  app.listen(process.env.PORT || 8080);
});

// get

getBoards = async () => {
  const kanban = await client
    .db('kanban')
    .collection('users')
    .find({ username: 'admin' })
    .toArray();
  if (kanban.length > 0) {
    return kanban[0].boards;
  }
  return [];
};

app.get('/getBoards', async (req, res) => {
  try {
    return res.json(await getBoards());
  } catch (err) {
    return res.status(500).send(err);
  }
});

const getBoardsPaginated = async (req) => {
  const pageNumber = parseInt(req.query.pageNumber);
  const swimlaneTitle = req.query.swimlaneTitle;
  const pageSize = 10;
  const boards = await getBoards();

  const updatedBoards = boards.map((board) => {
    if (!board.tickets) {
      return board;
    }

    if (board.tickets.length === 0) {
      return board;
    }

    const ticketsInSwimlane = board.tickets.filter(
      (ticket) => ticket.swimlaneTitle === swimlaneTitle
    );

    const startIndex = pageNumber * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedTickets = ticketsInSwimlane.slice(startIndex, endIndex);

    const tickets = board.tickets.map((ticket) =>
      ticket.swimlaneTitle === swimlaneTitle
        ? paginatedTickets.find(
            (paginatedTicket) =>
              paginatedTicket.ticketNumber === ticket.ticketNumber
          )
        : ticket
    );

    return {
      ...board,
      tickets,
    };
  });

  return updatedBoards;
};

app.get('/getBoardsPaginated', async (req, res) => {
  try {
    return res.json(await getBoardsPaginated(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

dueThisWeekTickets = (filteredTickets) => {
  var startOfWeek = moment().startOf('week');
  var endOfWeek = moment().endOf('week');

  filteredTickets = filteredTickets.filter((ticket) => {
    let ticketDueDate = new Date(ticket.dueDate);
    return moment(ticketDueDate).isBetween(startOfWeek, endOfWeek, null, '[]');
  });

  return filteredTickets;
};

dueThisMonthTickets = (filteredTickets) => {
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

dueTodayTickets = (filteredTickets) => {
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

const getBoardsPaginatedWithFilters = async (req) => {
  const searchTerm = req.query.searchTerm;
  const isDueTodayFilterOn = req.query.isDueTodayFilterOn === true;
  const isDueThisWeekFilterOn = req.query.isDueThisWeek === true;
  const isDueThisMonthFilterOn = req.query.isDueThisMonth === true;
  const paginatedBoards = await getBoards(req);

  const filteredBoards = paginatedBoards.map((board) => {
    if (!board.tickets) {
      return board;
    }

    if (board.tickets.length === 0) {
      return board;
    }

    if (board.isCurrentBoard) {
      const filteredTickets = board.tickets.filter((ticket) => {
        const hasMatchingTags =
          board.activeTags.length === 0 ||
          ticket.tags.some((tag) => board.activeTags.includes(tag));

        const isDueToday =
          isDueTodayFilterOn && dueTodayTickets([ticket]).length > 0;
        const isDueThisWeek =
          isDueThisWeekFilterOn && dueThisWeekTickets([ticket]).length > 0;
        const isDueThisMonth =
          isDueThisMonthFilterOn && dueThisMonthTickets([ticket]).length > 0;

        return (
          (ticket.description.includes(searchTerm) ||
            ticket.title.includes(searchTerm)) &&
          hasMatchingTags &&
          (!isDueTodayFilterOn || isDueToday) &&
          (!isDueThisWeekFilterOn || isDueThisWeek) &&
          (!isDueThisMonthFilterOn || isDueThisMonth)
        );
      });

      return {
        ...board,
        tickets: filteredTickets,
      };
    } else {
      return board;
    }
  });

  return filteredBoards;
};

app.get('/getBoardsPaginatedWithFilters', async (req, res) => {
  try {
    return res.json(await getBoardsPaginatedWithFilters(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

const getBoardsOnlyTenInEachSwimlane = async () => {
  const boards = await getBoards();

  for (const board of boards) {
    for (const swimlane of SWIMLANE_TITLES) {
      const ticketsInSwimlane = board.tickets.filter(
        (ticket) => ticket.swimlaneTitle === swimlane
      );

      ticketsInSwimlane.sort((a, b) => a.index - b.index);

      const first10Tickets = ticketsInSwimlane.slice(0, 10);

      board.tickets = board.tickets.filter(
        (ticket) => ticket.swimlaneTitle !== swimlane
      );
      board.tickets.push(...first10Tickets);
    }
  }

  return boards;
};

app.get('/getBoardsOnlyTenInEachSwimlane', async (req, res) => {
  try {
    return res.json(await getBoardsOnlyTenInEachSwimlane());
  } catch (err) {
    return res.status(500).send(err);
  }
});

const getMaxPagesForSwimlane = async (req) => {
  const swimlaneTitle = req.query.swimlaneTitle;
  const pageSize = 10;
  const boards = await getBoards();

  const currentBoard = boards.find((board) => board.isCurrentBoard);

  if (!currentBoard) {
    return { maxPages: '0' };
  }

  const ticketsInCurrentBoardSwimlane = currentBoard.tickets.filter(
    (ticket) => ticket.swimlaneTitle === swimlaneTitle
  );

  const maxPages = Math.ceil(ticketsInCurrentBoardSwimlane.length / pageSize);

  const finalMaxPages = Math.max(maxPages, 1);

  return { maxPages: finalMaxPages.toString() };
};

app.get('/getMaxPagesForSwimlane', async (req, res) => {
  try {
    const result = await getMaxPagesForSwimlane(req);
    return res.json(result);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/getTicketsPaginatedWithinBoards', async function (req, res) {
  const pageSize = 10;

  const boards = await getBoards();
  const currentBoard = boards.find((board) => board.isCurrentBoard);

  if (!currentBoard) {
    return res.status(400).send('No current board found.');
  }

  function paginateSwimlaneTickets(swimlane, tickets) {
    const startIndex = 0;
    const endIndex = startIndex + pageSize;

    const paginatedSwimlaneTickets = tickets.slice(startIndex, endIndex);

    return {
      ...swimlane,
      tickets: paginatedSwimlaneTickets,
    };
  }

  const boardsWithPaginatedSwimlanes = boards.map((board) => {
    if (board._id === currentBoard._id) {
      const swimlanes = currentBoard.swimlanes || [];
      const paginatedSwimlanes = swimlanes.map((swimlane) =>
        paginateSwimlaneTickets(swimlane, currentBoard.tickets)
      );

      return {
        ...currentBoard,
        swimlanes: paginatedSwimlanes,
      };
    } else {
      return board;
    }
  });

  return res.status(200).send(boardsWithPaginatedSwimlanes);
});

app.get('/getCurrentBoardSwimlaneTicketsPaginated', async function (req, res) {
  const swimlaneTitle = req.query.swimlaneTitle;
  const pageNumber = parseInt(req.query.pageNumber);
  const pageSize = 10;

  const boards = await getBoards();
  const currentBoard = boards.find((board) => board.isCurrentBoard);

  if (!currentBoard) {
    return res.status(400).send('No current board found.');
  }
  if (!currentBoard.tickets) {
    currentBoard.tickets = [];
  }

  const swimlaneTickets = currentBoard.tickets.filter(
    (ticket) => ticket.swimlaneTitle === swimlaneTitle
  );

  const adjustedPageNumber = pageNumber - 1; // start at 0
  const startIndex = adjustedPageNumber * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedTickets = swimlaneTickets.slice(startIndex, endIndex);

  return res.status(200).send(paginatedTickets);
});

const getSwimlaneTicketsAtFirstPage = async (req) => {
  const swimlaneTitle = req.query.swimlaneTitle;
  const boards = await getBoards();

  const selectedSwimlane = SWIMLANE_TITLES.find(
    (lane) => lane === swimlaneTitle
  );

  if (selectedSwimlane) {
    const allTickets = boards.reduce((acc, board) => {
      const ticketsInSwimlane = board.tickets.filter(
        (ticket) => ticket.swimlaneTitle === selectedSwimlane
      );

      ticketsInSwimlane.sort((a, b) => a.index - b.index);

      acc.push(...ticketsInSwimlane);
      return acc;
    }, []);

    const first10Tickets = allTickets.slice(0, 10);

    return first10Tickets;
  }
  return [];
};

app.get('/getSwimlaneTicketsAtFirstPage', async (req, res) => {
  try {
    return res.json(await getSwimlaneTicketsAtFirstPage(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

// post
setBoards = async (boards) => {
  try {
    const collection = await client.db('kanban').collection('users');
    const query = {
      username: 'admin',
    };
    const options = { upsert: true };
    collection.updateOne(
      query,
      {
        $set: {
          boards,
        },
      },
      options
    );
  } catch (err) {
    throw err;
  }
};

app.post('/setBoards', async function (req, res) {
  try {
    await setBoards(req.body.boards);
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/setActiveTags', async (req, res) => {
  try {
    const collection = client.db('kanban').collection('users');

    const query = {
      username: 'admin',
    };

    const options = { upsert: true };

    const activeTags = req.body.activeTags;

    await collection.updateOne(
      query,
      {
        $set: {
          'boards.$[board].activeTags': activeTags,
        },
      },
      {
        arrayFilters: [{ 'board._id': req.body.boardId }],
        ...options,
      }
    );

    res.status(200).send({ status: 'OK' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/updateTicketSwimlane', async function (req, res) {
  try {
    const ticketId = req.body.ticketNumber;
    const newSwimlaneTitle = req.body.title;
    const previousSwimlaneTitle = req.body.previousSwimlaneTitle;
    const newIndex = req.body.currentIndex;
    const previousIndex = req.body.previousIndex;
    const lanePageNumber = req.body.lanePageNumber;

    const collection = await client.db('kanban').collection('users');

    const updatedBoard = await collection.findOne({
      'boards.tickets.ticketNumber': ticketId,
    });

    if (!updatedBoard) {
      return res
        .status(404)
        .send({ error: 'Board not found containing the ticket' });
    }

    const currentBoard = updatedBoard.boards.find(
      (board) => board.isCurrentBoard
    );

    if (!currentBoard) {
      return res.status(404).send({ error: 'Current board not found' });
    }

    const PAGE_SIZE = 10;
    const currentPage = parseInt(lanePageNumber);
    const indexOnPage = newIndex % PAGE_SIZE;
    let newIndexInSwimlane = indexOnPage;
    if (currentPage > 1) {
      newIndexInSwimlane = newIndexInSwimlane + (currentPage - 1) * PAGE_SIZE;
    }

    const draggedTicketIndex = currentBoard.tickets.findIndex(
      (ticket) => ticket.ticketNumber === ticketId
    );

    if (draggedTicketIndex === -1) {
      return res.status(404).send({ error: 'Dragged ticket not found' });
    }

    const updatedTickets = [...currentBoard.tickets];

    const [draggedTicketObject] = updatedTickets.splice(draggedTicketIndex, 1);

    updatedTickets.splice(newIndexInSwimlane, 0, {
      ...draggedTicketObject,
      index: newIndexInSwimlane,
      swimlaneTitle: newSwimlaneTitle,
    });

    // update the indices for the rest of the tickets in the swimlane
    updatedTickets.forEach((ticket) => {
      if (
        ticket.index >= newIndexInSwimlane &&
        ticket.swimlaneTitle === newSwimlaneTitle &&
        ticket.ticketNumber !== draggedTicketObject.ticketNumber
      ) {
        ticket.index = ticket.index + 1;
      }
      if (
        ticket.index >= previousIndex &&
        ticket.swimlaneTitle === previousSwimlaneTitle &&
        ticket.ticketNumber !== draggedTicketObject.ticketNumber
      ) {
        ticket.index = ticket.index - 1;
      }
    });

    updatedTickets.sort((a, b) => a.index - b.index);

    const updateFilter = {
      '_id': updatedBoard._id,
      'boards.isCurrentBoard': true,
    };

    const updateQuery = {
      $set: { 'boards.$[board].tickets': updatedTickets },
    };

    const updateOptions = {
      arrayFilters: [{ 'board.isCurrentBoard': true }],
    };

    await collection.updateOne(updateFilter, updateQuery, updateOptions);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error updating ticket:', err);
    return res
      .status(500)
      .send({ error: 'An error occurred while updating the ticket' });
  }
});

app.post('/updateCurrentBoardStatus', async function (req, res) {
  try {
    const boards = await getBoards();
    const updatedId = req.body.id;

    boards.forEach((board) => {
      if (board._id === updatedId) {
        board.isCurrentBoard = true;
      } else {
        board.isCurrentBoard = false;
      }
    });

    const collection = await client.db('kanban').collection('users');
    const query = {
      username: 'admin',
    };
    const update = {
      $set: {
        boards: boards,
      },
    };
    const options = { upsert: true };

    await collection.updateOne(query, update, options);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/updateCurrentBoardTitle', async function (req, res) {
  try {
    const boards = await getBoards();
    const board = boards.find((board) => board._id === req.body._id);

    const collection = await client.db('kanban').collection('users');
    const query = {
      'username': 'admin',
      'boards._id': board._id,
    };
    const options = { upsert: true };
    collection.updateOne(
      query,
      {
        $set: {
          'boards.$.title': req.body.title,
        },
      },
      options
    );
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/addNewBoardToBoards', async (req, res) => {
  try {
    const existingBoards = await getBoards();

    const currentBoard = existingBoards.find((board) => board.isCurrentBoard);

    if (currentBoard) {
      currentBoard.isCurrentBoard = false;
    }

    const newBoard = {
      title: 'board title',
      tickets: [],
      tags: [],
      activeTags: [],
      index: 0,
      collapsedLanes: [],
      _id: uuidv4(),
      isCurrentBoard: true,
    };

    existingBoards.push(newBoard);

    await setBoards(existingBoards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error adding new board:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/addTagToCurrentTicket', async (req, res) => {
  try {
    const { tag, ticketNumber } = req.body;
    const boards = await getBoards();

    const updatedBoards = boards.map((board) => {
      if (board.isCurrentBoard && board.tickets?.length > 0) {
        const updatedTickets = board.tickets.map((ticket) => {
          if (ticket.ticketNumber === ticketNumber) {
            return {
              ...ticket,
              tags: [...new Set([...ticket.tags, tag])],
            };
          }
          return ticket;
        });
        return { ...board, tickets: updatedTickets };
      }
      return board;
    });

    await setBoards(updatedBoards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error adding tag to current ticket:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/removeTagFromCurrentTicket', async (req, res) => {
  try {
    const { tagToRemove, ticketNumber } = req.body;
    const boards = await getBoards();

    const updatedBoards = boards.map((board) => {
      if (board.isCurrentBoard && board.tickets?.length > 0) {
        const updatedTickets = board.tickets.map((ticket) => {
          if (ticket.ticketNumber === ticketNumber) {
            const updatedTags = ticket.tags.filter(
              (tag) => tag !== tagToRemove
            );
            return {
              ...ticket,
              tags: updatedTags,
            };
          }
          return ticket;
        });
        return { ...board, tickets: updatedTickets };
      }
      return board;
    });

    await setBoards(updatedBoards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error removing tag from current ticket:', err);
    return res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/addTagToCurrentBoard', async function (req, res) {
  try {
    const newTag = req.body.tag;
    const boards = await getBoards();

    const currentBoard = boards.find((board) => board.isCurrentBoard);

    if (!currentBoard) {
      return res.status(400).send('No current board found.');
    }

    if (!currentBoard.tags) {
      currentBoard.tags = [];
    }

    if (currentBoard.tags.includes(newTag)) {
      return res.status(400).send('Tag already exists in the current board.');
    }

    currentBoard.tags.push(newTag);

    await setBoards(boards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error adding tag:', err);
    return res.status(500).send(err);
  }
});

app.post('/updateTicket', async function (req, res) {
  try {
    const { ticketNumber, field, value } = req.body;
    const boards = await getBoards();

    const currentBoard = boards.find((board) => board.isCurrentBoard);

    if (!currentBoard) {
      return res.status(400).send('No current board found.');
    }

    const ticketToUpdate = currentBoard.tickets.find(
      (ticket) => ticket.ticketNumber === ticketNumber
    );

    if (!ticketToUpdate) {
      return res
        .status(404)
        .send(`Ticket with ticketNumber ${ticketNumber} not found.`);
    }

    if (field in ticketToUpdate) {
      ticketToUpdate[field] = value;
    } else {
      return res.status(400).send(`Invalid field: ${field}`);
    }

    await setBoards(boards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error updating ticket:', err);
    return res.status(500).send(err);
  }
});

app.post('/addTicketToCurrentBoard', async function (req, res) {
  try {
    const newTicket = req.body;
    const boards = await getBoards();

    const currentBoard = boards.find((board) => board.isCurrentBoard);

    if (!currentBoard) {
      return res.status(400).send('No current board found.');
    }

    if (!currentBoard.tickets) {
      currentBoard.tickets = [];
    }

    // shift the indices for the rest of the tickets in the swimlane
    currentBoard.tickets.forEach((ticket) => {
      if (
        ticket.swimlaneTitle === newTicket.swimlaneTitle &&
        ticket.index >= newTicket.index
      ) {
        ticket.index++;
      }
    });

    currentBoard.tickets.unshift(newTicket);

    await setBoards(boards);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error adding ticket:', err);
    return res.status(500).send(err);
  }
});

app.post('/addCollapsedLaneToCurrentBoardSave', async (req, res) => {
  try {
    const { lane } = req.body;
    const collection = await client.db('kanban').collection('users');

    const query = {
      'username': 'admin',
      'boards.isCurrentBoard': true,
    };

    const update = {
      $addToSet: {
        'boards.$.collapsedLanes': lane,
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .send({ status: 'Lane added to current board successfully' });
    } else {
      return res
        .status(404)
        .send({ status: 'No board found with isCurrentBoard true' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.post('/removeCollapsedLaneFromCurrentBoardSave', async (req, res) => {
  try {
    const { lane } = req.body;
    const collection = await client.db('kanban').collection('users');

    const query = {
      'username': 'admin',
      'boards.isCurrentBoard': true,
    };

    const update = {
      $pull: {
        'boards.$.collapsedLanes': lane,
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .send({ status: 'Lane removed from current board successfully' });
    } else {
      return res
        .status(404)
        .send({ status: 'No board found with isCurrentBoard true' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

// delete

app.delete('/deleteCurrentBoard', async (req, res) => {
  try {
    const collection = await client.db('kanban').collection('users');

    const query = {
      'username': 'admin',
      'boards.isCurrentBoard': true,
    };

    const update = {
      $pull: {
        boards: { isCurrentBoard: true },
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res.status(200).send({ status: 'Board deleted successfully' });
    } else {
      return res
        .status(404)
        .send({ status: 'No board found with isCurrentBoard true' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.delete('/deleteBoard/:boardId', async (req, res) => {
  try {
    const collection = await client.db('kanban').collection('users');

    const boardId = req.params.boardId;

    const query = {
      'username': 'admin',
      'boards._id': boardId,
    };

    const update = {
      $pull: {
        boards: { _id: boardId },
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res.status(200).send({ status: 'Board deleted successfully' });
    } else {
      return res
        .status(404)
        .send({ status: 'No board found with the specified ID' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.delete('/deleteTicket/:ticketNumber', async (req, res) => {
  try {
    const collection = await client.db('kanban').collection('users');

    const ticketNumber = req.params.ticketNumber;

    const query = {
      username: 'admin',
      boards: {
        $elemMatch: {
          'isCurrentBoard': true,
          'tickets.ticketNumber': ticketNumber,
        },
      },
    };

    const update = {
      $pull: {
        'boards.$.tickets': { ticketNumber: ticketNumber },
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res.status(200).send({ status: 'Ticket deleted successfully' });
    } else {
      return res.status(404).send({ status: 'No matching ticket found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});

app.delete('/deleteCurrentBoardTag/:tag', async (req, res) => {
  try {
    const collection = await client.db('kanban').collection('users');

    const tagToDelete = req.params.tag;

    const query = {
      username: 'admin',
      boards: {
        $elemMatch: {
          isCurrentBoard: true,
          tags: tagToDelete,
        },
      },
    };

    const update = {
      $pull: {
        'boards.$.tags': tagToDelete,
      },
    };

    const result = await collection.updateOne(query, update);

    if (result.modifiedCount > 0) {
      return res.status(200).send({ status: 'Tag deleted successfully' });
    } else {
      return res.status(404).send({ status: 'No matching tag found' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
});
