//Setting up connection
//_____________________
mongoose = require("mongoose");

console.log("process.env.MONGO_DB_URL", process.env.MONGO_DB_URL);

mongoose.connect(
  `mongodb+srv://FPR:NY77rx0l8C0KUuc8@cluster0.it36tqj.mongodb.net/fpr`
);

mongoose.Promise = global.Promise;
module.exports = exports = mongoose;
