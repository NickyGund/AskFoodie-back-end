import {Router} from 'express';
import { addChildComment, addParentComment, findChildComments, findComments } from './comment.controller.js';

const routes = new Router();

routes.post('/addParentComment', addParentComment);
routes.post('/addChildComment', addChildComment);
routes.get('/findComments', findComments);
routes.get('/findChildComments', findChildComments);


export default routes;