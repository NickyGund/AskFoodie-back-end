// https://github.com/gothinkster/node-express-realworld-example-app/blob/master/routes/api/profiles.js
// https://expressjs.com/en/api.html#router.METHOD
import { find, getInfo } from "./places.controller.js"

var router = require('express').Router();

router.get("/find", find)
router.get("/info", getInfo)

module.exports = router;