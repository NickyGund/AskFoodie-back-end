import {Router} from 'express';
import { addChildComment, addParentComment } from './comment.controller.js';

const routes = new Router();

routes.post('/addParentComment', addParentComment);
routes.post('/addChildComment', addChildComment);

export default routes;