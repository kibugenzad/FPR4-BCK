//Setting up connection
//_____________________
mongoose = require("mongoose");

const dbName = "bbis-access-donor";
mongoose.connect(
  `${process.env.MONGO_DB_URL}`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

mongoose.Promise = global.Promise;
module.exports = exports = mongoose;
