import { Router } from "express";
import { findRestaurant } from "../Restaurant/restaurant.controller.js";
import {
  addChildComment,
  addParentComment,
  findChildComments,
  findComments,
  findRestaurantComments,
  deleteComment,
} from "./comment.controller.js";

const routes = new Router();

routes.post("/addParentComment", addParentComment);
routes.post("/addChildComment", addChildComment);
routes.get("/findComments", findComments);
routes.get("/findChildComments", findChildComments);
routes.get("/findCommentsForRestaurant", findRestaurantComments);
routes.get("/deleteComment", deleteComment);

export default routes;
