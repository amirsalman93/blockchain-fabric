

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://usman:Usm@n270@cluster0-y9nmi.gcp.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});