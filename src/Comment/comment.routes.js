import {Router} from 'express';
import { addChildComment, addParentComment, findComments } from './comment.controller.js';

const routes = new Router();

routes.post('/addParentComment', addParentComment);
routes.post('/addChildComment', addChildComment);
routes.get('/findComments', findComments);


export default routes;