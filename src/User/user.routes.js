import expressJwt from 'express-jwt';
import { Router } from 'express';
import {login, register, checkAuth, addProfileInfo} from './user.controller.js';

const secret = 'This is my secret';
const routes = new Router();

routes.post('/login', login);
routes.post('/register', register);
routes.get('/auth', expressJwt({ secret }), checkAuth);
routes.post('/addProfileInfo', addProfileInfo);
routes.use('/places', require("./places"));

export default routes;