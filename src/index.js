import 'dotenv/config';
import express from 'express';
import db from "./db"
import bodyParser from 'body-parser';
import UserRoute from './User/user.routes';
import requireAuth from "./middleware/requireAuth"


const app = express();
db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));
app.use("/api", UserRoute );


/*
app.get('/', requireAuth, (req, res) => {
  res.send(`Your id: ${req.user._id}`);
});
*/

app.get('/', function (req, res) {
  res.send(`Howdy, ${req.ip}`);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});