const authenticationRoute = require("../Controllers/userController");
const router = require("express").Router();

router.post("/register", authenticationRoute.register);
router.post("/login", authenticationRoute.login);
router.post("/profilePicture/:id", authenticationRoute.profilePicture);
router.get("/getUsers/:id", authenticationRoute.getUsers);
router.get("/getFollower/:id", authenticationRoute.getFollower);
router.put("/followUser/", authenticationRoute.followUser);
router.get("/logOut/:id", authenticationRoute.logOut);
router.post(
  "/changeProfilePicture/:id",
  authenticationRoute.changeProfilePicture
);
router.post("/changeUsername/:id", authenticationRoute.changeUsername);

module.exports = router;
