const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {

  const dateTime = `${format(new Date(), "MM/dd/yyyy HH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {

    if(!fs.existsSync(path.join(__dirname, "..", "logs"))) {

      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));

    }

    await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);

  } catch (error) {

    console.log(error);

  }
};

const logger = (request, response, nextPiece) => {
  
  logEvents(`${request.method}\t${request.url}\t${request.headers.origin}`, "requestLogs.log");
  console.log(`${request.method} ${request.path}`);
  nextPiece();

}

module.exports = { logEvents, logger };