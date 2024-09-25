const express = require("express");
const {
  getTopViews,
  addViews,
  getAllView,
} = require("../controllers/countVIewsControllers");

const countviewRouter = express.Router();

countviewRouter.post("/add", addViews);
countviewRouter.get("/top", getTopViews);
countviewRouter.get("/nghe-nhieu", getAllView);
module.exports = countviewRouter;
