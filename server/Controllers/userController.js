const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports.register = async (req, res) => {
  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    const emailCheck = await User.findOne({ email: req.body.email });
    if (usernameCheck) {
      return res.json({ message: "Username already in use!", status: false });
    } else if (emailCheck) {
      return res.json({ message: "Email already in use!", status: false });
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // creating a new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    // saving the user to the database
    return res.json({ status: true, newUser });
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res) => {
  try {
    const newUser = await User.findOne({ email: req.body.email });
    if (!newUser) {
      return res.json({ message: "Incorrect email/password!", status: false });
    }
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      newUser.password
    );
    if (!passwordCheck) {
      return res.json({ message: "Incorrect email/password!", status: false });
    }
    return res.json({ status: true, newUser });
  } catch (err) {
    console.log(err);
  }
};

module.exports.profilePicture = async (req, res) => {
  try {
    const userID = req.params.id;
    const image = req.body.profilePicture;
    const userData = await User.findByIdAndUpdate(
      userID,
      {
        profilePicture: image,
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

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.params.id },
    }).select(["email", "username", "profilePicture", "follower", "_id"]);
    return res.json(users);
  } catch (err) {
    console.log(err);
  }
};

module.exports.getFollower = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.sendStatus(404);

    return res.json({ id: user.follower?.toString() ?? null });
  } catch (err) {
    console.log(err);
  }
};

module.exports.followUser = async (req, res) => {
  try {
    const { userId, followerId } = req.body;
    if (!userId) return res.sendStatus(400);

    await User.findByIdAndUpdate(userId, {
      follower: followerId ?? null,
    });
    res.sendStatus(200);
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
    const userID = req.params.id;
    const image = req.body.profilePicture;
    const userData = await User.findByIdAndUpdate(
      userID,
      {
        profilePicture: image,
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
    const userID = req.params.id;
    const newUsername = req.body.newUsername;
    const userData = await User.findByIdAndUpdate(
      userID,
      {
        username: newUsername,
      },
      { new: true }
    );
    return res.json({
      username: userData.username,
    });
  } catch (err) {
    console.log(err);
  }
};
