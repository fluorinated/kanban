// this function is needed for Heroku
function requireHTTPS(req, res, next) {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

const express = require('express');
const cors = require('cors');
const app = express();

var corsOptions = {
  origin: [
    'http://localhost:4200',
    'http://localhost:8080',
    'https://balance-checker-angular.herokuapp.com',
  ],
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./dist/balance-checker'));

const MongoClient = require('mongodb').MongoClient;
const dbUser = 'm2015dominguez';
const dbPw = 'XWJ67Y1AJHCZfRrI';
const uri = `mongodb+srv://${dbUser}:${dbPw}@cluster0.9dhxiiv.mongodb.net/kanban?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
if (process.env.NODE_ENV === 'production') {
  // app.get("/*", function(req, res) {
  //   res.sendFile("index.html", { root: "dist/balance-checker/" },
  //   );
  // });
}

app.get('/getBalance', async (req, resp) => {
  // let collection = await client
  //   .db("BalanceChecker")
  //   .collection("UserInfo")
  //   .aggregate([
  //     {
  //       $project: {
  //         userInfo: {
  //           $filter: {
  //             input: "$userInfo.account",
  //             as: "infoObject",
  //             cond: { $eq: ["$$infoObject.cardNumber", req.query.cardNumber] },
  //           },
  //         },
  //       },
  //     },
  //   ])
  //   .toArray();

  let balance = 'success!';

  // if (collection[0]) {
  //     balance = collection[0].userInfo[0] ? collection[0].userInfo[0].balance : "";
  //   }

  return resp.json(balance);
});

client.connect((err) => {
  if (err) {
    process.exit(100);
  }
  app.listen(process.env.PORT || 8080);
});
