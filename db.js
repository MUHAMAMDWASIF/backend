const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect(process.env.MONGOURI, () => {
    console.log("hello wasif");
  });
};
module.exports = connectToMongo;
