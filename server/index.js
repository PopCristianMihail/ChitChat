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

let users = [];

socket.on("connection", (socket) => {
  socket.on("join", (userId) => {
    users.push({ userId, socketId: socket.id });
  });
  socket.on("sendMessage", (data) => {
    const receiver = users.find((user) => user.userId === data.receiver);
    if (receiver) {
      socket.to(receiver.socketId).emit("getMessage", {
        message: data.message,
        sender: data.sender,
        receiver: data.receiver,
      });
    }
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });
});
