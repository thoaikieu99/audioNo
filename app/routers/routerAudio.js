const express = require("express");
const {
  getAudio,
  getNewAudio,
  getSearch,
} = require("../controllers/audioControllers");

const audioRouter = express.Router();
audioRouter.get("/new", getNewAudio);
audioRouter.get("/search", getSearch);
audioRouter.get("/:slug", getAudio);

module.exports = audioRouter;
