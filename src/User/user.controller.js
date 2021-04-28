import User from "./user.schema.js";
import {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
} from "./validation.js";

export const login = async (req, res) => {
  //validate information
  const { error } = loginValidation(req.body);

  if (error) {
    return res.json({ error: true, data: error.details[0].message });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: true, data: "cannot find email" });
    }

    await user.comparePassword(password);
    await user.updateOne({ signedIn: true });
    res.json({ error: false, data: user.toJSON() });
  } catch (e) {
    return res.json({ error: true, data: e });
  }
};

export const register = async (req, res) => {
  //validate user info
  const { error } = registerValidation(req.body);

  if (error) {
    return res.json({ error: true, data: error.details[0].message });
  }
  //check if email is in use
  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) {
    return res.json({ error: true, data: "email already exists." });
  }

  // create new user
  try {
    const user = await User.create(req.body);
    res.json({ error: false, data: user.toJSON() });
  } catch (e) {
    res.json({ error: true, data: e });
  }
};

export const checkAuth = async (req, res) => {
  try {
    console.log(req.user + "my");
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ error: true, data: "wrong token" });
    }
    return res.json({ error: false, data: user });
  } catch (e) {
    return res.json({ error: true, data: e });
  }
};

export const addProfileInfo = async (req, res) => {
  const update = req.body;

  const keys = Object.keys(update);
  keys.sort();
  if (
    JSON.stringify(keys) !=
    JSON.stringify(["dining", "distance", "foodTypes", "price"])
  ) {
    return res.status(400).send({ data: "invalid params" });
  }

  const email = req.headers.email;
  var user;
  try {
    user = await User.findOneAndUpdate({ email }, { profileInfo: update });
  } catch (err) {
    console.log(err);
    return res.status(503).end();
  }
  return res.send({ error: false, data: user });
};

export const checkUserName = async (req, res) => {
  try {
    const existingUserName = await User.findOne({
      userName: req.params.userName,
    });

    if (existingUserName) {
      return res.json({ error: false, exists: true });
    } else {
      return res.json({ error: false, exists: false });
    }
  } catch (e) {
    return res.json({ error: true, data: e.message });
  }
};

export const checkEmail = async (req, res) => {
  try {
    const { error } = emailValidation(req.params);
    if (error) {
      return res.json({ error: true, data: error.details[0].message });
    }
    const existingEmail = await User.findOne({ email: req.params.email });

    if (existingEmail) {
      return res.json({ error: false, exists: true });
    } else {
      return res.json({ error: false, exists: false });
    }
  } catch (e) {
    return res.json({ error: true, data: e.message });
  }
};

export const addLike = async (req, res) => {
  try {
    //getParentComment
    await User.updateOne(
      { userName: req.body.userName },
      { $push: { likes: req.body.restaurant } }
    );
    return res.json({ error: false });
  } catch (error) {
    res.json({ error: true, data: error });
  }
};

export const addDislike = async (req, res) => {
  try {
    //getParentComment
    await User.updateOne(
      { userName: req.body.userName },
      { $push: { dislikes: req.body.restaurant } }
    );
    return res.json({ error: false });
  } catch (error) {
    res.json({ error: true, data: error });
  }
};

export const getLikes = async (req, res) => {
  try {
    const user = User.findOne({ userName: req.query.userName });
    console.log(req.query.userName);
    const likes = await user.select("likes");
    console.log(likes.toString());
    return res.json({ error: false, data: likes.likes });
  } catch (error) {
    console.log(error);
    res.json({ error: true, data: error });
  }
};

export const getDislikes = async (req, res) => {
  try {
    //getParentComment
    const user = User.findOne({ userName: req.query.userName });
    const dislikes = await user.select("dislikes");
    return res.json({ error: false, data: dislikes.dislikes });
  } catch (error) {
    res.json({ error: true, data: error });
  }
};
