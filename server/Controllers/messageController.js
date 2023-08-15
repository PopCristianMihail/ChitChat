const Message = require("../Models/messageModel");

module.exports.sendMessage = async (req, res) => {
  try {
    const { message, receiver, sender } = req.body;

    if (!receiver) return res.sendStatus(400);

    const response = await Message.create({
      message: { text: message },
      users: [sender, receiver],
      sender,
    });

    if (response) return res.json({ message: "Message sent succesfully" });
    res.json({ message: "Message failed" });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const messages = await Message.find({
      users: { $all: [sender, receiver] },
    }).sort({ updatedAt: 1 });
    const mappedMessages = messages.map((msg) => {
      return {
        fromCurrentUser: msg.sender.toString() === sender,
        message: msg.message.text,
      };
    });
    res.json(mappedMessages);
  } catch (err) {
    console.log(err);
  }
};

module.exports.deleteConversation = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const response = await Message.deleteMany({
      users: { $all: [sender, receiver] },
    });

    if (response) return res.json({ message: "Conversation deleted", status: true });
    res.json({ message: "Conversation not deleted", status: false });
  } catch (err) {
    console.log(err);
  }
};
