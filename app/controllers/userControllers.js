const { User } = require("../model");
const catchAsync = require("../ultils/catchAsync");
const AppError = require("../ultils/appErrors");

const getAll = catchAsync(async (req, res) => {
  const getall = await User.findAll({});
  res.status(200).json({
    status: "success",
    data: {
      user: getall,
    },
  });
});

const getOne = async (id) => {
  let getOneUser = await User.findOne({
    where: {
      id,
    },
    attributes: { exclude: ["password_hash"] },
  });
  return getOneUser;
};
const creatUser = catchAsync(async (req, res) => {
  let newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

const getUser = catchAsync(async (req, res, next) => {
  let getone = await getOne(req.params.id);

  if (!getone) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: getone,
    },
  });
});
const updateUser = catchAsync(async (req, res, next) => {
  let getone = await getOne(req.params.id);

  if (!getone) {
    return next(new AppError("No user found with that ID", 404));
  }
  let update = await getone.update(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: update,
    },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  let getone = await getOne(req.params.id);

  if (!getone) {
    return next(new AppError("No user found with that ID", 404));
  }
  let deleteUser = await getone.destroy();

  res.status(200).json({
    status: "success",
    data: {
      user: deleteUser,
    },
  });
});
const CheckLogin = catchAsync(async (req, res, next) => {
  let getone = req?.user?.username;

  if (!getone) {
    new AppError("You are not logged in! please log in to get access.", 401);
  }

  res.status(200).json({
    status: "success",
    data: {
      username: getone,
    },
  });
});

module.exports = {
  getAll,
  getUser,
  creatUser,
  updateUser,
  deleteUser,
  CheckLogin,
};
