const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const io = require("socket.io");
const userRoute = require("./Routes/userRoute");
const messageRoute = require("./Routes/messageRoute");
const app = express();
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use("/server/authentication", userRoute);
app.use("/server/messages", messageRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

const socket = io(server, {
  cors: {
    origin: "http://192.168.100.104:3000",
    credentials: true,
  },
});

// In a production ready app, we would use Redis to store the users array
let userPool = [];

socket.on("connection", (socket) => {
  socket.on("join", (user) => {
    userPool.push({
      userId: user._id,
      followerId: user.followerId,
      socketId: socket.id,
    });
  });
  socket.on("updateFollower", (currentUser) => {
    for (let i = 0; i < userPool.length; i++) {
      if (userPool[i].userId === currentUser.userId) {
        userPool[i].followerId = currentUser.followerId;
      }
    }
  });
  socket.on("sendMessage", (currentUser) => {
    // The handshake
    //
    // The receiver is computed by finding the user
    // in the user pool, whose follower is the sender
    const receiver = userPool.find(
      (user) => user.followerId === currentUser.sender
    );
    if (receiver) {
      socket.to(receiver.socketId).emit("getMessage", {
        message: currentUser.message,
      });
    }
  });
  socket.on("disconnect", () => {
    userPool = userPool.filter((user) => user.socketId !== socket.id);
  });
});
