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
  let {
    query = "",
    page = 1,
    limit = 10,
    sort,
    role,
    subject,
    studyMode,
    experienceLevel,
  } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const filter = {};

  // Search by query (name, email, location)
  if (query) {
    const searchRegex = new RegExp(query, "i");
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { location: searchRegex },
    ];
  }

  // Filters
  if (role) filter.role = role;
  if (subject) filter.subject = { $regex: new RegExp(subject, "i") };
  if (studyMode !== undefined) filter.studyMode = studyMode === "true";
  if (experienceLevel) filter.experienceLevel = experienceLevel;

  const totalDocs = await User.countDocuments(filter);
  const totalPages = Math.ceil(totalDocs / limit);

  let userQuery = User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit);

  if (sort) {
    userQuery = userQuery.sort(sort.split(",").join(" "));
  }

  const users = await userQuery;

  res.status(200).json({
    status: "success",
    message:
      users.length === 0
        ? "No user found matching your criteria"
        : "Users fetched successfully",
    page,
    totalPages,
    total: totalDocs,
    data: { users },
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
