const User = require("../model/userModel");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
const asyncHandler = require("express-async-handler");
const { userSchemaValidator } = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/verifyToken");

// GET /users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return next(new ErrorHandler("Please filled the form properly.", 422));
    }

    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid Email", 422));
    }

    if (confirmPassword !== password) {
      // return res.status(422).json({ error: "Passwords Must Matched" });
      return next(new ErrorHandler("Passwords Must Matched.", 422));
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          return next(new ErrorHandler("Error deleting file", 500));
        } else {
          return next(new ErrorHandler("File deleted Successfully", 200));
        }
      });
      return next(new ErrorHandler("User already exist with email", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = crateActivationToken(user);

    const activationUrl = `${process.env.CLIENT_URL}/activation/${activationToken}`;
    const message = `   
    <div
    style="
      width: 658px;
      border-radius: 0px;
      padding: 48px;
      background: #f1f3f4;
    "
  >
    <h2>Hello ${user.name}, </h2>
    <p>Please use the url below to activate your account</p>
    <p>This link expires in 5 minutes</p>
  
    <p
      style="
        padding: 19px 32px;
        text-decoration: none;
        color: white;
  
        width: 211px;
        background: rgba(62, 69, 235, 1);
      "
    >
      <a
        href="${activationUrl}"
        clicktracking="off"
        style="
          font-family: 'Satoshi';
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 140%;
          display: flex;
          align-items: center;
          text-align: center;
          color: #ffffff;
          text-decoration: none;
          justify-content: center;
        "
        >Activate Account</a
      >
    </p>
     <a href="${activationUrl}" clicktracking="off">${activationUrl}</a>
  
    <p>Regards...</p>
  </div>
    `;

    const subject = "Activate Account";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
      await sendMail(subject, message, send_to, sent_from);
      res.status(200).json({
        success: true,
        message: `Please check your email to activate account`,
      });
    } catch (error) {
      res.status(500).send({ status: "Fail", message: error.message });
    }
  } catch (error) {
    const filename = req.file.filename;
    const filePath = `uploads/${filename}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("Error deleting file");
      } else {
        console.log("File deleted Successfully");
      }
    });

    res.status(400).json({ status: "error", message: error.message });
  }
};

const activateAccount = asyncHandler(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const decoded = await verifyToken(activation_token);

    if (!decoded) {
      return next(new ErrorHandler("Invalid Token", 400));
    }

    const { name, email, password, avatar } = decoded;

    const user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exist", 400));
    }

    const newUser = User.create({ name, email, password, avatar });
    const token = await user.generateToken();

    console.log(newUser);
    res.status(201).json({
      status: "Success",
      message: "Registeration Successfully",
      data: { newUser, token },
    });
  } catch (error) {}
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return next(new errorHandler("Invalid Email", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "No Credentials Found" });
  }

  const validPassword = await user.confirmPassword(password);

  if (!validPassword) {
    return res.status(401).json({ message: "Incorrect Password" });
  }

  const token = user.generateToken();

  res.status(200).json({ data: user, token });
});

// GET /users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    console.log(req.user);

    if (!user) {
      return next(new errorHandler(`User with ID ${user} not found`, 400));
    }
    res.status(200).json({ user });
  } catch (error) {
    return next(new errorHandler(error.message, 400));
  }
};

// PUT /users/:id
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the request body with Zod
    const validatedData = await userSchemaValidator.validateAsync(req.body);

    // Update the user with the validated data
    const user = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw ErrorHandler(404, `User with ID ${id} not found`);
    }
    res.json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      // Convert the Zod validation error to a HTTP error
      next(ErrorHandler(422, error.errors));
    } else if (error.kind === "ObjectId") {
      next(ErrorHandler(404, `User with ID ${req.params.id} not found`));
    } else {
      next(error);
    }
  }
};

// DELETE /users/:id
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw ErrorHandler(404, `User with ID ${id} not found`);
    }
    res.sendStatus(204);
  } catch (error) {
    if (error.kind === "ObjectId") {
      next(ErrorHandler(404, `User with ID ${req.params.id} not found`));
    } else {
      next(error);
    }
  }
};

const logOut = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "Sucessfully Logged Out",
    });
  } catch (error) {
    return next(ErrorHandler(500, error.message));
  }
};
// Create Activation Token
const crateActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = {
  getUsers,
  createUser,
  Login,
  getUserById,
  updateUser,
  deleteUser,
  activateAccount,
  logOut,
};
