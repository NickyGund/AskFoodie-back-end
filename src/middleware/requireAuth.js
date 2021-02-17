import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from "../User/user.schema.js";

const SECRET = 'This is my secret'

export default (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'You must be logged in.' });
    }

    const { sub } = payload;

    const user = await User.findById(sub);
    req.user = user;
    next();
  });
};
