const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isProfilePictureSet: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
