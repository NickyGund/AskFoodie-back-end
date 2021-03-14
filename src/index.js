import 'dotenv/config.js';
import express from 'express';
import db from "./db.js"
import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';
import UserRoute from './User/user.routes.js';
import PlacesRouter from "./Places/places.routes.js"
import requireAuth from "./middleware/requireAuth.js"

const secret = 'This is my secret';

const app = express();
db();

app.set('trust proxy', true)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false,}));
app.use("/api", UserRoute );
app.use('/api/places', expressJwt({ secret }), PlacesRouter);

app.get('/', requireAuth, (req, res) => {
  res.send(`Your id: ${req.user._id}`);
});

let port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log(`We're listening on port ${port}.`)
});