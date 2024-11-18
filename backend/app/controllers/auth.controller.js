const ApiError = require("../api-error");
const AuthService = require("../services/auth.service");
const MongoDB = require("../utils/mongodb.util");

exports.login = async (req, res, next) => {
  try {
    const authService = new AuthService(MongoDB.client);
    const result = await authService.login(req.body);

    if (!result) {
      return next(new ApiError(404, "User not found"));
    }

    if (result === "Invalid password") {
      return next(new ApiError(400, "Invalid password"));
    }

    return res.send(result);
  } catch (error) {
    return next(new ApiError(500, "An error ocurred"));
  }
};
exports.register = async (req, res, next) => {
  try {
    const authService = new AuthService(MongoDB.client);
    const document = await authService.register(req.body);

    if (document === "User already exists") {
      return next(new ApiError(400, "User already exists"));
    }
    if (document === "An error ocurred") {
      return next(new ApiError(400, "An error ocurred"));
    }

    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "An error ocurred"));
  }
};
