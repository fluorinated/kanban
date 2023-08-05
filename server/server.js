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

app.post('/setBoards', async function (req, res) {
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
          boards: req.body.boards,
        },
      },
      options
    );
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/updateTicketSwimlane', async function (req, res) {
  try {
    const ticketId = req.body.ticketNumber;
    const newSwimlaneTitle = req.body.title;
    const newIndex = req.body.currentIndex;
    const previousIndex = req.body.previousIndex;

    const collection = await client.db('kanban').collection('users');

    const result = await collection.findOneAndUpdate(
      {
        'boards.tickets.ticketNumber': ticketId,
      },
      {
        $set: {
          'boards.$[board].tickets.$[ticket].swimlaneTitle': newSwimlaneTitle,
          'boards.$[board].tickets.$[ticket].index': newIndex,
        },
      },
      {
        arrayFilters: [
          { 'board.tickets.ticketNumber': ticketId },
          { 'ticket.ticketNumber': ticketId },
        ],
      }
    );

    const updatedBoard = result.value;

    if (!updatedBoard) {
      return res
        .status(404)
        .send({ error: 'Board not found containing the ticket' });
    }

    const updatedTicket = updatedBoard.boards[0].tickets.find(
      (ticket) => ticket.ticketNumber === ticketId
    );

    if (!updatedTicket) {
      return res.status(404).send({ error: 'Ticket not found in the board' });
    }

    // update all tickets with the same swimlane title as the updated ticket's previous swimlane title
    const previousSwimlaneTitle = updatedTicket.swimlaneTitle;
    const ticketsToUpdate = updatedBoard.boards[0].tickets.filter(
      (ticket) => ticket.swimlaneTitle === previousSwimlaneTitle
    );

    const updatedTickets = ticketsToUpdate.map((ticketToUpdate) => {
      if (ticketToUpdate.ticketNumber === ticketId) {
        // update the moved ticket with the new index and swimlane title
        return {
          ...ticketToUpdate,
          index: newIndex,
          swimlaneTitle: newSwimlaneTitle,
        };
      } else if (
        ticketToUpdate.index >= newIndex &&
        ticketToUpdate.index < previousIndex
      ) {
        // shift up the indexes between the new and previous index (when moving up within the same swimlane)
        return { ...ticketToUpdate, index: ticketToUpdate.index + 1 };
      } else if (
        ticketToUpdate.index <= newIndex &&
        ticketToUpdate.index > previousIndex
      ) {
        // shift down the indexes between the previous and new index (when moving down within the same swimlane)
        return { ...ticketToUpdate, index: ticketToUpdate.index - 1 };
      } else {
        return ticketToUpdate;
      }
    });

    // update the board with the updated ticket list
    await collection.updateOne(
      { _id: updatedBoard._id },
      { $set: { 'boards.0.tickets': updatedTickets } }
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
          title: 'title',
          tickets: [
            {
              title: 'craft crochet pouches',
              ticketNumber: await getNextTicketNumber(),
              description:
                '* watch youtube videos * practice basic crocheting methods',
              tags: ['buy', 'dress-up', 'fun'],
              dueDate: 'friday, may 26, 2023',
              createdDate: 'tuesday, may 16, 2023',
              swimlaneTitle: 'backlog',
              index: 0,
            },
          ],
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
