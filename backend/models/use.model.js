const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: [true, "userName is already taken"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "email is already exists whith this email"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);
