const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");

exports.me = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.getMe = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };

  const excludeFields = ["page", "limit", "sort", "fields"];

  excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);

  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt|regex|options)\b/g,
    (match) => `$${match}`
  );

  let query = User.find(JSON.parse(queryStr));

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }

  const page = parseInt(req.query.page, 11) || 1;
  const limit = parseInt(req.query.limit, 11) || 11;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const users = await query;

  if (!users || users.length === 0) {
    return next(new AppError("No user found!", 404));
  }

  const totalUsers = await User.countDocuments(JSON.parse(queryStr));

  res.status(200).json({
    status: "success",
    results: users.length,
    page,
    totalPages: Math.ceil(totalUsers / limit),
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

function filterObj(obj, ...allowedFields) {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });

  return newObject;
}

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /api/v1/users/updatePassword.",
        400
      )
    );
  }
  const id = req.user.id;
  const updates = req.body;

  const filterBody = filterObj(
    updates,
    "name",
    "image",
    "subject",
    "studyMode",
    "availability",
    "experienceLevel",
    "location",
    "ratingAverage"
  );

  await User.findByIdAndUpdate(id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "user updated successfully!",
  });
});
