const { deleteChatRoom, getChatRoom, sendMessage } = require("../controllers/messagesCTRL");

const router = require("express").Router();

router
  .route("/sendMessage")
  .post((req, res) => sendMessage(req, res, req.app.locals.io));

router.get("/:chatRoomId", (req, res) => {
  getChatRoom(req, res, req.app.locals.io);
});

router.delete("/:chatRoomId", (req, res) =>
  deleteChatRoom(req, res, req.app.locals.io)
);
module.exports = router;
