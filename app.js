const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { DBConnection } = require("./DBConnection/DBConnect");
const ErrorHandler = require("./utils/ErrorHandler");
const error = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const user = require("./routes/userRoute");
const seller = require("./routes/shopRoute");

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
    allowedHeaders: "*",
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user", user);
app.use("/api/v1/seller", seller);
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 8000;

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server for handling uncaught exception");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(error);

const server = app.listen(port, () => {
  console.log(`Server is running at http:localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for Error: ${err.message}`);
  console.log(`Shutting down the server for unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
