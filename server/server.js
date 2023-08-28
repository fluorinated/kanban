var express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

var corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:4200'],
};

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static('.'));

const MongoClient = require('mongodb').MongoClient;
const uri =
  'mongodb+srv://m2015dominguez:kbdbpw2023md@cluster0.9dhxiiv.mongodb.net/kanban?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  if (err) {
    console.log(err);
    process.exit(100);
  }
  app.listen(process.env.PORT || 8080);
});

app.get('/getCurrentBoardSwimlaneTicketsPaginated', async function (req, res) {
  try {
    const swimlaneTitle = req.query.swimlaneTitle;
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = 10;

    const kanban = await client
      .db('kanban')
      .collection('users')
      .find({ username: 'admin' })
      .toArray();

    if (kanban.length > 0) {
      const boards = kanban[0].boards;

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

      // adjust the pageNumber to start at 0
      const adjustedPageNumber = pageNumber - 1;

      const startIndex = adjustedPageNumber * pageSize;
      const endIndex = startIndex + pageSize;

      const paginatedTickets = swimlaneTickets.slice(startIndex, endIndex);

      return res.status(200).send(paginatedTickets);
    }
  } catch (err) {
    console.error('Error getting swimlane tickets:', err);
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

    newTicket.index = 0;

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

    return res.status(200).send({ status: 'OK', boards });
  } catch (err) {
    console.error('Error adding ticket:', err);
    return res.status(500).send(err);
  }
});

getMaxPagesForSwimlane = async (req) => {
  const swimlaneTitle = req.query.swimlaneTitle;
  const pageSize = 10;
  const kanban = await client
    .db('kanban')
    .collection('users')
    .find({ username: 'admin' })
    .toArray();

  if (kanban.length > 0) {
    const boards = kanban[0].boards;

    const totalTicketsInSwimlane = boards.reduce((total, board) => {
      if (!board.tickets) {
        return total;
      }

      const ticketsInSwimlane = board.tickets.filter(
        (ticket) => ticket.swimlaneTitle === swimlaneTitle
      );

      return total + ticketsInSwimlane.length;
    }, 0);

    const maxPages = Math.ceil(totalTicketsInSwimlane / pageSize);

    return { maxPages: maxPages.toString() };
  }
};

getBoardsPaginated = async (req) => {
  const pageNumber = parseInt(req.query.pageNumber);
  const swimlaneTitle = req.query.swimlaneTitle;
  const pageSize = 10;
  const kanban = await client
    .db('kanban')
    .collection('users')
    .find({ username: 'admin' })
    .toArray();

  if (kanban.length > 0) {
    const boards = kanban[0].boards;

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

      const updatedSwimlaneTickets = board.tickets.map((ticket) =>
        ticket.swimlaneTitle === swimlaneTitle
          ? paginatedTickets.find(
              (paginatedTicket) =>
                paginatedTicket.ticketNumber === ticket.ticketNumber
            )
          : ticket
      );

      return {
        ...board,
        tickets: updatedSwimlaneTickets,
      };
    });

    return updatedBoards;
  }
};

const getSwimlaneTicketsAtFirstPage = async (req) => {
  const swimlaneTitle = req.query.swimlaneTitle;

  const kanban = await client
    .db('kanban')
    .collection('users')
    .find({ username: 'admin' })
    .toArray();

  if (kanban.length > 0) {
    const swimlanes = [
      'backlog',
      'rdy 2 start',
      'in progress',
      'blocked',
      'done',
    ];

    const selectedSwimlane = swimlanes.find((lane) => lane === swimlaneTitle);

    if (selectedSwimlane) {
      const allTickets = kanban[0].boards.reduce((acc, board) => {
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
  }

  return [];
};

getBoardsOnlyTen = async () => {
  const kanban = await client
    .db('kanban')
    .collection('users')
    .find({ username: 'admin' })
    .toArray();

  if (kanban.length > 0) {
    const boards = kanban[0].boards;

    for (const board of boards) {
      const swimlanes = [
        'backlog',
        'rdy 2 start',
        'in progress',
        'blocked',
        'done',
      ];

      for (const swimlane of swimlanes) {
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
  }

  return [];
};

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

app.get('/getMaxPagesForSwimlane', async (req, res) => {
  try {
    return res.json(await getMaxPagesForSwimlane(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/getBoards', async (req, res) => {
  try {
    return res.json(await getBoards());
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/getBoardsOnlyTen', async (req, res) => {
  try {
    return res.json(await getBoardsOnlyTen());
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/getBoardsPaginated', async (req, res) => {
  try {
    return res.json(await getBoardsPaginated(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get('/getSwimlaneTicketsAtFirstPage', async (req, res) => {
  try {
    return res.json(await getSwimlaneTicketsAtFirstPage(req));
  } catch (err) {
    return res.status(500).send(err);
  }
});

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

app.post('/updateTicketSwimlane', async function (req, res) {
  try {
    const ticketId = req.body.ticketNumber;
    const newSwimlaneTitle = req.body.title;
    const previousSwimlaneTitle = req.body.previousSwimlaneTitle;
    const newIndex = req.body.currentIndex;
    const previousIndex = req.body.previousIndex;
    const lanePageNumber = req.body.lanePageNumber;

    const collection = await client.db('kanban').collection('users');

    const result = await collection.findOneAndUpdate(
      {
        'boards.tickets.ticketNumber': ticketId,
      },
      {
        $set: {
          'boards.$[board].tickets.$[ticket].swimlaneTitle': newSwimlaneTitle,
        },
      },
      {
        arrayFilters: [
          { 'board.tickets.ticketNumber': ticketId },
          { 'ticket.ticketNumber': ticketId },
        ],
        returnOriginal: false,
      }
    );

    const updatedBoard = result.value;

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

    currentBoard.tickets = updatedTickets;

    await collection.updateOne(
      { _id: updatedBoard._id },
      { $set: { 'boards.$[board].tickets': updatedTickets } },
      {
        arrayFilters: [{ 'board.isCurrentBoard': true }],
      }
    );

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    console.error('Error updating ticket:', err);
    return res
      .status(500)
      .send({ error: 'An error occurred while updating the ticket' });
  }
});

app.post('/updateCurrentBoardTitle', async function (req, res) {
  try {
    let boards = await getBoards();
    let board = boards.find((board) => board._id === req.body._id);

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

async function getNextTicketNumber(boardId) {
  const collection = await client.db('kanban').collection('users');

  const query = {
    '_id': boardId,
    'boards.tickets.ticketNumber': { $regex: /^MD-\d+$/ },
  };
  const projection = { 'boards.$': 1 }; // select the first matching board where _id matches

  const result = await collection.findOne(query, projection);

  let nextTicketNumber = 1;

  if (result && result.boards && result.boards.length > 0) {
    const currentBoard = result.boards[0];

    // calc the highest ticket number in the current board's tickets
    let highestTicketNumber = 0;

    for (const ticket of currentBoard.tickets) {
      const ticketNumber = parseInt(ticket.ticketNumber.split('-')[1]);
      if (!isNaN(ticketNumber) && ticketNumber > highestTicketNumber) {
        highestTicketNumber = ticketNumber;
      }
    }

    nextTicketNumber = highestTicketNumber + 1;
  }

  const formattedTicketNumber = `MD-${nextTicketNumber}`;

  return formattedTicketNumber;
}

app.get('/getNextTicketNumber', async (req, res) => {
  try {
    const boardId = req.query.boardId;
    const nextTicketNumber = await getNextTicketNumber(boardId);
    return res.status(200).json(nextTicketNumber);
  } catch (err) {
    return res.status(500).send(err);
  }
});

const getFormattedDate = (date) => {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${dayOfWeek}, ${month} ${day}, ${year}`.toLowerCase();
};

app.post('/addNewBoardToBoards', async (req, res) => {
  try {
    const collection = await client.db('kanban').collection('users');

    const query = {
      username: 'admin',
    };
    const options = { upsert: true };
    const update = {
      $push: {
        boards: {
          title: 'board title',
          tickets: [],
          tags: [],
          activeTags: [],
          index: 2,
          collapsedLanes: [],
          _id: uuidv4(),
          isCurrentBoard: true,
        },
      },
    };
    collection.updateOne(query, update, options);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

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
