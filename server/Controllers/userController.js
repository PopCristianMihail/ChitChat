const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username: username });
    const emailCheck = await User.findOne({ email: email });
    if (usernameCheck) return res.json({
      message: "Username already in use!",
      status: false
    });
    
    if (emailCheck) return res.json({
      message: "Email already in use!",
      status: false
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.json({ status: true, newUser });
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const newUser = await User.findOne({ email });
    if (!newUser) return res.json({
      message: "Incorrect email/password!",
      status: false
    });

    const passwordCheck = await bcrypt.compare(
      password,
      newUser.password
    );
    if (!passwordCheck) return res.json({
      message: "Incorrect email/password!",
      status: false
    });

    res.json({ status: true, newUser });
  } catch (err) {
    console.log(err);
  }
};

module.exports.profilePicture = async (req, res) => {
  try {
    const { id: userID} = req.params;
    const { profilePicture } = req.body;

    const userData = await User.findByIdAndUpdate(
      userID,
      {
        profilePicture,
        isProfilePictureSet: true,
      },
      { new: true }
    );

    res.json({
      image: userData.profilePicture,
      isSet: userData.isProfilePictureSet,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.params.id },
    }).select(["email", "username", "profilePicture", "_id"]);
    return res.json(users);
  } catch (err) {
    console.log(err);
  }
};

module.exports.logOut = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.json({ status: true });
  } catch (err) {
    console.log(err);
  }
};

module.exports.changeProfilePicture = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const { profilePicture } = req.body;

    const userData = await User.findByIdAndUpdate(
      userID,
      {
        profilePicture,
        isProfilePictureSet: true,
      },
      { new: true }
    );
    return res.json({
      image: userData.profilePicture,
      isSet: userData.isProfilePictureSet,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.changeUsername = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const { newUsername } = req.body;

    const userData = await User.findByIdAndUpdate(
      userID,
      { username: newUsername },
      { new: true }
    );
    return res.json({ username: userData.username });
  } catch (err) {
    console.log(err);
  }
};
