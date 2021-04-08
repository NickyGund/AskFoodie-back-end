import { Router } from 'express';
import { addRestaurant, findRestaurant } from './restaurant.controller.js';

const routes = new Router();

routes.post('/addRestaurant', addRestaurant);
routes.get('./findRestaurant', findRestaurant);

export default routes;