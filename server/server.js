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
  return kanban[0].boards;
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
      username: 'admin'
    };
    const options = { upsert: true };
    collection.updateOne(
      query,
      {
        $set: {
          "boards": req.body.boards,
        },
      },
      options
    );
    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post('/updateCurrentBoardTitle', async function (req, res) {
  try {
    let boards = await getBoards();
    let board = boards.find((board) => board._id === req.body._id);

    const collection = await client.db('kanban').collection('users');
    const query = {
      username: 'admin',
      "boards._id": board._id
    };
    const options = { upsert: true };
    collection.updateOne(
      query,
      {
        $set: {
          "boards.$.title": req.body.title,
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
              ticketNumber: 'MD-619',
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
          isCurrentBoard: false,
        },
      },
    };
    collection.updateOne(query, update, options);

    return res.status(200).send({ status: 'OK' });
  } catch (err) {
    return res.status(500).send(err);
  }
});
