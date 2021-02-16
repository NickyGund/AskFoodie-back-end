import expressJwt from 'express-jwt';
import { Router } from 'express';
import {login, register, checkAuth} from './user.controller';

const secret = 'This is my secret';
const routes = new Router();

routes.post('/login', login);
routes.post('/register', register);
routes.get('/auth', expressJwt({ secret }), checkAuth);

export default routes;