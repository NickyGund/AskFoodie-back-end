import { Router } from 'express';
import { addRestaurant, testPost } from './restaurant.controller.js';

const routes = new Router();

routes.post('/addRestaurant', addRestaurant);

export default routes;