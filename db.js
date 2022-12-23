const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect(process.env.MONGOURI, {  useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,},() => {
    console.log("hello wasif");
  });
};
module.exports = connectToMongo;
