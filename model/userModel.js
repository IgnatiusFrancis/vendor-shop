const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty"],

    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  passwordChangedAt: Date,
  avatar: String,
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRES,
    }
  );

  return token;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// An instance method is a method that will be available on all doc of a certain collection
userSchema.methods.confirmPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp;
  }

  // by default, the method returns false i.e password not change
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
