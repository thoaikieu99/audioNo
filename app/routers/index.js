const express = require("express");
const audioRouter = require("./routerAudio");
const userRouter = require("./routerUser");
const categoriRouter = require("./routerCategori");
const countviewRouter = require("./countView");
const TuTruyenRouter = require("./routerTuTruyen");

const router = express.Router();

router.use("/audios", audioRouter);
router.use("/users", userRouter);
router.use("/categories", categoriRouter);
router.use("/countviews", countviewRouter);
router.use("/tu-truyen", TuTruyenRouter);
module.exports = router;
