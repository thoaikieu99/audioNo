const express = require("express");
const { getShow, getSlugAudio } = require("../controllers/categoriControllers");

const categoriRouter = express.Router();

categoriRouter.get("/show", getShow);
categoriRouter.get("/:slug", getSlugAudio);

module.exports = categoriRouter;
