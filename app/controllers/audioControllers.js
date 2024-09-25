const { Audio } = require("../model");
const catchAsync = require("../ultils/catchAsync");
const { Op } = require("sequelize");
const AppError = require("../ultils/appErrors");
const NodeRSA = require("node-rsa");

const getAudio = catchAsync(async (req, res, next) => {
  let getOneAudio = await Audio.findOne({
    where: {
      slug: req.params.slug,
    },
    attributes: [
      "id",
      "slug",
      "title",
      "content",
      "trang_thai",
      "sotap",
      "image",
      "link_audio",
    ],
  });

  if (!getOneAudio) {
    return next(new AppError("No audio found with that slug", 404));
  }
  const key = new NodeRSA();
  key.importKey(process.env.API_PUB);
  let encrypted = key.encrypt(JSON.stringify(getOneAudio.link_audio), "base64");

  let dataa = { ...getOneAudio.dataValues, link_audio: encrypted };

  res.status(200).json({
    status: "success",
    data: {
      audio: dataa,
    },
  });
});

const getSearch = catchAsync(async (req, res, next) => {
  let name = req?.query?.name;
  let address = req?.query?.search;
  if (!name || !name.trim()) {
    return next(new AppError("No string", 404));
  }

  let getone = name.trim().split("-");
  let trueArr = getone.filter(Boolean).join("%");
  let page = req?.query?.page ? req.query.page : 1;
  console.log(trueArr);
  console.log(page);
  let getNew = await Audio.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${trueArr}%`,
      },
    },
    attributes: ["slug", "title", "content", "trang_thai", "sotap", "image"],
    limit: address == "yes" ? 8 : 30,
    offset: 30 * (page - 1),
  });

  res.status(200).json({
    data: getNew,
  });
});

const getNewAudio = catchAsync(async (req, res, next) => {
  let page = req?.query?.page ? req.query.page : 0;
  let getNew = await Audio.findAndCountAll({
    order: [["date", "desc"]],
    attributes: ["slug", "title", "content", "trang_thai", "sotap", "image"],
    limit: 30,
    offset: 30 * page,
  });

  res.status(200).json({
    status: "success",
    data: getNew,
  });
});

module.exports = {
  getAudio,
  getNewAudio,
  getSearch,
};
