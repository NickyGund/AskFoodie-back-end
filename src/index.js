import 'dotenv/config.js';
import express from 'express';
import db from "./db.js"
import bodyParser from 'body-parser';
import UserRoute from './User/user.routes.js';
import requireAuth from "./middleware/requireAuth.js"

const app = express();
db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));
app.use("/api", UserRoute );

app.get('/', requireAuth, (req, res) => {
  res.send(`Your id: ${req.user._id}`);
});

let port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log(`We're listening on port ${port}.`)
});