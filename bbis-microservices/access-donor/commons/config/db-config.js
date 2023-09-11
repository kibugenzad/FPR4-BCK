//Setting up connection
//_____________________

mongoose.connect("mongodb://huza:HzAmrt12Qpoly@polycluster0-shard-00-00-nnzhu.mongodb.net:27017,polycluster0-shard-00-01-nnzhu.mongodb.net:27017,polycluster0-shard-00-02-nnzhu.mongodb.net:27017/bbis-access?ssl=true&replicaSet=polycluster0-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })


mongoose.Promise = global.Promise;
module.exports = exports = mongoose;