import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;
const SECRET = "This is my secret";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      require: [true, "Email is required"],
      trim: true,
    },
    firstName: {
      type: String,

      trim: true,
    },
    lastName: {
      type: String,

      trim: true,
    },
    userName: {
      type: String,
      required: [true, "UserName is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [6, "Password needs to be longer"],
    },
    birthdate: {
      type: Date,
      trim: true,
      required: [true, "Password is required"],
    },
    profileInfo: {
      distance: Number,
      foodTypes: Array,
      price: String,
      dining: Number,
    },
    signedIn: {
      type: Boolean,
      default: false,
      required: [true],
    },
    admin: {
      type: Boolean,
      default: false,
      required: [true],
    },
    likes: {
      type: Array,
      required: [false],
    },
    dislikes: {
      type: Array,
      required: [false],
    },
  },
  { timestamps: true, strict: false }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      userName: this.userName,
      password: this.password,
      token: jwt.sign({ sub: this._id }, SECRET),
      signedIn: this.signedIn,
      email: this.email,
      admin: this.admin,
    };
  },

  getLikes() {
    return { likes: this.likes };
  },

  comparePassword(candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
        if (err) {
          return reject(err);
        }

        if (!isMatch) {
          return reject("incorrect password");
        }

        resolve(true);
      });
    });
  },
};

export default mongoose.model("User", userSchema);
