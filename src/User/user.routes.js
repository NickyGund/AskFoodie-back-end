import expressJwt from "express-jwt";
import { Router } from "express";
import {
  login,
  register,
  checkAuth,
  addProfileInfo,
  checkEmail,
  checkUserName,
  addLike,
  addDislike,
  getLikes,
  getDislikes,
} from "./user.controller.js";

const secret = "This is my secret";
const routes = new Router();

routes.post("/login", login);
routes.post("/register", register);
routes.get("/auth", expressJwt({ secret }), checkAuth);
routes.post("/addProfileInfo", addProfileInfo);
routes.get("/check_username/:userName", checkUserName);
routes.get("/check_email/:email", checkEmail);
routes.post("/addLike", addLike);
routes.post("/addDislike", addDislike);
routes.get("/getLikes", getLikes);
routes.get("/getDislikes", getDislikes);

export default routes;
