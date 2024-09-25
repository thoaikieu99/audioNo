const catchAsync = require("../ultils/catchAsync");
const AppError = require("../ultils/appErrors");
const { Categorie, sequelize } = require("../model");

const getOne = async (slug) => {
  let getOneAudio = await Categorie.findOne({
    where: {
      slug,
    },
  });
  return getOneAudio;
};

const getShow = catchAsync(async (req, res) => {
  const getall = await Categorie.findAll({
    where: { show: 1 },
  });
  res.status(200).json({
    status: "success",
    data: {
      theLoai: getall,
    },
  });
});

const getSlugAudio = catchAsync(async (req, res, next) => {
  let slug = req.params.slug;
  let page = req?.query?.page ? req.query.page : 0;
  const get = await getOne(slug);
  if (!get) {
    return next(new AppError("Khong tim duoc the loai", 404));
  }
  let nameTheLoai = get.name;
  let Audio = sequelize.model("Audio");
  let Categories = sequelize.model("Categorie");
  const result = await Audio.findAndCountAll({
    include: [{ model: Categories, where: { slug } }],
    attributes: ["slug", "title", "content", "trang_thai", "sotap", "image"],
    order: [["id", "ASC"]],
    limit: 42,
    offset: 42 * page,
  });

  res.status(200).json({
    status: "success",
    nameTheLoai,
    data: {
      theLoai: result,
    },
  });
});

module.exports = {
  getShow,
  getSlugAudio,
};
