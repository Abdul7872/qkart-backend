const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server ;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port

const DB = config.mongoose.url;
const PORT = config.port;

mongoose.connect(DB, config.mongoose.options)
.then(()=>{
  console.log(`connection successful ${DB}`);
}).catch(err=> console.log(err))


app.listen(PORT,()=>{
  console.log(`server is running at port no ${PORT}`)
})
// ------------- Don't Modify  -------------
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
// ------------- Don't Modify  -------------
