
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOURI ,()=>{
  console.log('connected to db');
});