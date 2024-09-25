const { Sequelize } = require("sequelize");
const { CountView, Audio } = require("../model");
const { Op } = require("sequelize");
const catchAsync = require("../ultils/catchAsync");

const getOne = async (audio_id) => {
  let getOneView = await CountView.findOne({
    where: {
      audio_id,
    },
  });
  return getOneView;
};

const createViews = async (audio_id, dayView, mouthView, yearView) => {
  let newViews = await CountView.create({
    countViewsD: 1,
    countViewsM: 1,
    countViewsY: 1,
    dayView,
    mouthView,
    yearView,
    audio_id,
  });
  return newViews;
};

const addViews = catchAsync(async (req, res) => {
  let dt = new Date();
  let dayView = dt.getDate();
  let mouthView = dt.getMonth() + 1;
  let yearView = dt.getFullYear();

  let getoOne = await getOne(req.body.audio_id);

  if (getoOne) {
    if (
      getoOne.dayView == +dayView &&
      getoOne.mouthView == +mouthView &&
      getoOne.yearView == +yearView
    ) {
      getoOne = await getoOne.update({
        countViewsD: getoOne.countViewsD + 1,
        countViewsM: getoOne.countViewsM + 1,
        countViewsY: getoOne.countViewsY + 1,
      });
    } else if (
      getoOne.mouthView == +mouthView &&
      getoOne.yearView == +yearView
    ) {
      getoOne = await getoOne.update({
        countViewsD: 1,
        dayView: +dayView,
        countViewsM: getoOne.countViewsM + 1,
        countViewsY: getoOne.countViewsY + 1,
      });
    } else if (getoOne.yearView == +yearView) {
      getoOne = await getoOne.update({
        countViewsD: 1,
        dayView: +dayView,
        mouthView: +mouthView,
        countViewsM: 1,
        countViewsY: getoOne.countViewsY + 1,
      });
    } else {
      getoOne = await createViews(
        req.body.audio_id,
        dayView,
        mouthView,
        yearView
      );
    }
  } else {
    getoOne = await createViews(
      req.body.audio_id,
      dayView,
      mouthView,
      yearView
    );
  }

  res.status(200).json({
    status: "success",
  });
});

const getAllView = catchAsync(async (req, res) => {
  let page = req?.query?.page ? req.query.page : 0;
  let getNew = await CountView.findAndCountAll({
    include: [
      {
        model: Audio,
        attributes: [
          "slug",
          "title",
          "content",
          "trang_thai",
          "sotap",
          "image",
        ],
      },
    ],
    order: [["countViewsY", "desc"]],
    limit: 42,
    offset: 42 * page,
  });

  res.status(200).json({
    status: "success",
    data: getNew,
  });
});

const getTopViews = catchAsync(async (req, res) => {
  let dt = new Date();
  let dayView = dt.getDate();
  let mouthView = dt.getMonth() + 1;
  let yearView = dt.getFullYear();
  let type = req?.query?.type;
  let where = {};

  switch (type) {
    case "day":
      where = {
        dayView,
        mouthView,
        yearView,
      };
      break;
    case "month":
      where = {
        mouthView,
        yearView,
      };
      break;
    case "year":
      where = {
        yearView,
      };
      break;
    default:
      where = {
        dayView,
        mouthView,
        yearView,
      };
      break;
  }
  let getTop = await CountView.findAndCountAll({
    where,
    attributes: ["audio_id", "countViewsD"],
    include: [
      {
        model: Audio,
        attributes: [
          "slug",
          "title",
          "content",
          "trang_thai",
          "sotap",
          "image",
        ],
      },
    ],
    order: [["countViewsD", "desc"]],
    limit: 12,
  });

  res.status(200).json({
    status: "success",
    data: getTop.rows,
  });
});

module.exports = {
  getTopViews,
  addViews,
  getAllView,
};
