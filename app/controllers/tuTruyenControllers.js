const { TuTruyen, Audio } = require("../model");
const AppError = require("../ultils/appErrors");
const catchAsync = require("../ultils/catchAsync");

const arra = (obj) => {
  const { recaudio, rectile, startspeed, startime, lastt, curr, audio_id } =
    obj.body;
  const arsr = {
    recaudio,
    rectile,
    startspeed,
    startime,
    lastt,
    curr,
    audio_id,
    user_id: obj.user.id,
  };
  return arsr;
};

const getOne = async (audio_id, user_id) => {
  let find = await TuTruyen.findOne({
    where: {
      user_id,
      audio_id,
    },
  });
  return find;
};
const getOneTT = catchAsync(async (req, res, next) => {
  let getOneTT = await getOne(req.params.id, req.user.id);
  if (!getOneTT) {
    return next(new AppError("not Find one TT", 500));
  }
  res.status(200).json({
    status: "success",
    data: {
      TuTruyen: getOneTT,
    },
  });
});
const creatTuTruyen = catchAsync(async (req, res, next) => {
  let getOneTT = await getOne(req.body.audio_id, req.user.id);

  if (getOneTT) {
    return next(new AppError("Find one TT", 500));
  }
  let aa = arra(req);
  let newTT = await TuTruyen.create(aa);

  res.status(201).json({
    status: "success",
    data: {
      TuTruyen: newTT,
    },
  });
});

const getTuTryen = catchAsync(async (req, res, next) => {
  let getNew = await TuTruyen.findAndCountAll({
    where: {
      user_id: req.user.id,
    },
    order: [["updatedAt", "desc"]],
    limit: 42,
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
  });

  res.status(200).json({
    status: "success",
    data: getNew,
  });
});

const updateTuTruyen = catchAsync(async (req, res, next) => {
  let getOneTT = await getOne(req.body.audio_id, req.user.id);

  if (!getOneTT) {
    return next(new AppError("No TT found with that slug", 404));
  }

  let aa = arra(req);
  delete aa.audio_id;

  let updateTT = await getOneTT.update(aa);

  res.status(201).json({
    status: "success",
    data: {
      TuTruyen: updateTT,
    },
  });
});

const deleteTT = catchAsync(async (req, res, next) => {
  let getOneTT = await getOne(req.params.id, req.user.id);

  if (!getOneTT) {
    return next(new AppError("No user found with that ID", 404));
  }
  let deleteUser = await getOneTT.destroy();

  res.status(200).json({
    status: "success",
    data: {
      user: deleteUser,
    },
  });
});

module.exports = {
  getTuTryen,
  creatTuTruyen,
  updateTuTruyen,
  deleteTT,
  getOneTT,
};
