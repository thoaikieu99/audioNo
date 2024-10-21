const express = require("express");
const {
  getAll,
  getUser,
  updateUser,
  deleteUser,
  creatUser,
  CheckLogin,
} = require("../controllers/userControllers");
const {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/authControllers");

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", login);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.patch("/resetPassword/:token", resetPassword);
userRouter.post("/", creatUser);

userRouter.use(protect);
userRouter.post("/updatePasswordMe", updatePassword);
userRouter.get("/checklg", CheckLogin);

userRouter.use(restrictTo("0", "1"));
userRouter.get("/:id", getUser);
userRouter.put("/:id", updateUser);
userRouter.get("/", getAll);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
