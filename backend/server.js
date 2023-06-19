require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectionDB = require("./config/dbConnection");
const PORT = process.env.PORT || 3240

console.log(process.env.NODE_ENV);

connectionDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/", require("./routes/userRoutes"));


app.all("*", (request, response) => {
  response.status(404);
  if(request.accepts('html')) {
    response.sendFile(path.join(__dirname,"public", "static", "404.html"))
  }else if(request.accepts("json")){
    response.json({message: "404 Not Found"});
  } else {
    response.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
});

mongoose.connection.on("error", error => {
  console.log(error);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoDBErrorLogs.log");
});

