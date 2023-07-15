var express = require("express");
const app = express();
const cors = require("cors");

var corsOptions = {
  origin: [
    "http://localhost:8080",
    "http://localhost:4200",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("."));

const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://m2015dominguez:kbdbpw2023md@cluster0.9dhxiiv.mongodb.net/kanban?retryWrites=true&w=majority";
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

app.post("/addNewBoardToBoards", async (req, res) => {
  try {
    const collection = await client.db("kanban").collection("me");

    const query = {
      name: "boards",
    };
    const options = { upsert: true };
    const update = {
      $push: {
        boards: {
          title: 'title',
          tickets: [ {
            title: 'craft crochet pouches',
            ticketNumber: 'MD-619',
            description: '* watch youtube videos * practice basic crocheting methods',
            tags: ['buy', 'dress-up', 'fun'],
            dueDate: 'friday, may 26, 2023',
            createdDate: 'tuesday, may 16, 2023',
            swimlaneTitle: 'backlog',
            index: 0,
        }],
          tags: [],
          activeTags: [],
          index: 2,
          collapsedLanes: [],
        },
      }
    };
    collection.updateOne(query, update, options);

    return res.status(200).send({ status: 'OK'});
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.get("/getBoards", async (req, res) => {
  try {
    const kanban = await client.db("kanban").collection("me").find({ name: "boards" }).toArray();
    return res.json(kanban);
  } catch (err) {
    return resp.status(500).send(err);
  }
});