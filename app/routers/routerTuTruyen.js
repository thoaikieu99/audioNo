const express = require("express");
const {
  getTuTryen,
  creatTuTruyen,
  updateTuTruyen,
  deleteTT,
} = require("../controllers/tuTruyenControllers");
const { protect } = require("../controllers/authControllers");

const TuTruyenRouter = express.Router();
TuTruyenRouter.use(protect);
TuTruyenRouter.post("/", creatTuTruyen);
TuTruyenRouter.put("/update", updateTuTruyen);
TuTruyenRouter.get("/", getTuTryen);
TuTruyenRouter.delete("/:id", deleteTT);
module.exports = TuTruyenRouter;
