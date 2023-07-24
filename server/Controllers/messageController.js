const Message = require("../Models/messageModel");

module.exports.sendMessage = async (req, res) => {
  try {
    const response = await Message.create({
      message: {
        text: req.body.message,
      },
      users: [req.body.sender, req.body.receiver],
      sender: req.body.sender,
    });
    response
      ? res.json({ message: "Message sent succesfully" })
      : res.json({ message: "Message failed" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      users: {
        $all: [req.body.sender, req.body.receiver],
      },
    }).sort({ updatedAt: 1 });
    const fetchMessages = messages.map((msg) => {
      return {
        fromCurrentUser: msg.sender.toString() === req.body.sender,
        message: msg.message.text,
      };
    });
    res.json(fetchMessages);
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteConversation = async (req, res) => {
  try {
    const response = await Message.deleteMany({
      users: {
        $all: [req.body.sender, req.body.receiver],
      },
    });
    response
      ? res.json({ message: "Conversation deleted", status: true })
      : res.json({ message: "Conversation not deleted", status: false });
  } catch (err) {
    console.log(err);
  }
};
