const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.route("/users")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .delete(usersController.deleteUser)

module.exports = router;
