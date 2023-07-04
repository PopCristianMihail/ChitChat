const messageRoute = require("../Controllers/messageController");
const router = require("express").Router();

router.post("/sendMessage/", messageRoute.sendMessage);
router.post("/getMessages/", messageRoute.getMessages);
router.post("/deleteConversation/", messageRoute.deleteConversation);

module.exports = router;
