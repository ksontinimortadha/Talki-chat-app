const router = require("express").Router();

const userController = require("../controllers/user");
const authController = require("../controllers/auth");

router.patch("/update-me", authController.protect, userController.updateMe);
router.get("/get-me", authController.protect, userController.getMe);

router.get("/get-users", authController.protect, userController.getUsers);
router.get("/get-requests", authController.protect, userController.getRequests);
router.get("/get-friends", authController.protect, userController.getFriends);

router.get(
  "/get-call-logs",
  authController.protect,
  userController.getCallLogs
);
router.post(
  "/start-audio-call",
  authController.protect,
  userController.startAudioCall
);

module.exports = router;
