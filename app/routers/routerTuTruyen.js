const express = require("express");
const {
  getTuTryen,
  creatTuTruyen,
  updateTuTruyen,
  deleteTT,
  getOneTT,
} = require("../controllers/tuTruyenControllers");
const { protect } = require("../controllers/authControllers");

const TuTruyenRouter = express.Router();
TuTruyenRouter.use(protect);
TuTruyenRouter.post("/", creatTuTruyen);
TuTruyenRouter.put("/update", updateTuTruyen);
TuTruyenRouter.get("/", getTuTryen);
TuTruyenRouter.get("/getone/:id", getOneTT);
TuTruyenRouter.delete("/:id", deleteTT);

module.exports = TuTruyenRouter;
