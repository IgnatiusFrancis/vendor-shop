const Shop = require("../model/shopModel");
const path = require("path");
const fs = require("fs");
const validator = require("validator");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/verifyToken");
const User = require("../model/userModel");

const createShop = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
      return next(new ErrorHandler("Please filled the form properly.", 422));
    }

    if (!validator.isEmail(email)) {
      return next(new ErrorHandler("Invalid Email", 422));
    }

    const findUser = await Shop.findOne({ email });

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
      address: address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = crateActivationToken(user);

    const activeUserAccount = await User.findOne({ email });
    if (activeUserAccount) {
      const newUser = await Shop.create(user);
      const token = crateActivationToken(user);

      res.status(201).json({
        success: true,
        message: "Registeration Successfully",
        data: { newUser, token },
      });
    } else {
      const activationUrl = `${process.env.CLIENT_URL}/seller/activation/${activationToken}`;
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
      <p>Please use the url below to activate your shop</p>
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
          >Activate Shop</a
        >
      </p>
       <a href="${activationUrl}" clicktracking="off">${activationUrl}</a>
    
      <p>Regards...</p>
    </div>
      `;

      const subject = "Activate your Shop";
      const send_to = user.email;
      const sent_from = process.env.EMAIL_USER;

      try {
        await sendMail(subject, message, send_to, sent_from);
        res.status(200).json({
          success: true,
          message: `Please check your email to activate your shop`,
        });
      } catch (error) {
        res.status(500).send({ status: "Fail", message: error.message });
      }
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

    const { name, email, password, avatar, address, phoneNumber, zipCode } =
      decoded;

    const user = await Shop.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exist", 400));
    }

    const newUser = Shop.create({
      name,
      email,
      password,
      avatar,
      address,
      phoneNumber,
      zipCode,
    });
    const token = await user.generateToken();

    res.status(201).json({
      status: "Success",
      message: "Registeration Successfully",
      data: { newUser, token },
    });
  } catch (error) {
    res.status(404).json({
      status: "Error",
      message: error.message,
    });
  }
});

const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    return next(new ErrorHandler("Invalid Email", 400));
  }

  const user = await Shop.findOne({ email }).select("+password");

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

const getSellerById = async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.user._id);

    if (!seller) {
      return next(new ErrorHandler(`Seller with ID ${user} not found`, 400));
    }
    res.status(200).json({ seller });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

const crateActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

const logOut = async (req, res, next) => {
  try {
    res.cookie("Token", null, {
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

module.exports = {
  createShop,
  activateAccount,
  Login,
  getSellerById,
  logOut,
};
