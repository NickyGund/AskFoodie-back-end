import expressJwt from 'express-jwt';
import { Router } from 'express';
import {login, register, checkAuth, addProfileInfo, checkEmail, checkUserName} from './user.controller.js';

const secret = process.env.MY_SECRET;
const routes = new Router();

// Setup endpoints on the user route
routes.post('/login', login);
routes.post('/register', register);
routes.get('/auth', expressJwt({ secret }), checkAuth);
routes.post('/addProfileInfo', addProfileInfo);
routes.get("/check_username/:userName",checkUserName)
routes.get("/check_email/:email", checkEmail)

export default routes;