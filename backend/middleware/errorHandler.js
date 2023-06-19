const { logEvents } = require("./logger");

const errorHandler = (error, request, response, nextPiece) => {
  
  logEvents(`${error.name}: ${error.message}${request.method}\t${request.url}\t${request.headers.origin}`, "errorLogs.log");
  console.log(error.stack);

  const status = response.statusCode ? response.statusCode : 500; // 500: Server Error

  response.status(status);

  response.json({ message: error.message});

}

module.exports = errorHandler;