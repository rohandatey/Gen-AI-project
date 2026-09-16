const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connectd to mongoDB!");
  } catch (error) {
    console.log("error to connectDB");
    process.exit(1);
  }
};
module.exports = connectDB;
