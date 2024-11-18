const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const EmployeeService = require("../services/employee.service");

exports.getAll = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const documents = await employeeService.getAll();
    return res.status(200).json(documents);
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving favorite contacts")
    );
  }
};
exports.getById = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);

    const document = await employeeService.getById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Publisher not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving book with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete book with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not updated book with id=${req.params.id}`)
    );
  }
};
exports.add = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.add(req.body);

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error ocurred while creating the contact")
    );
  }
};
exports.login = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const result = await employeeService.login(req.body);

    if (!result) {
      return next(new ApiError(404, "User not found"));
    }

    if (result === "Invalid password") {
      return next(new ApiError(400, "Invalid password"));
    }

    return res.send(result);
  } catch (error) {
    return next(
      new ApiError(500, "An error ocurred while creating the contact")
    );
  }
};
exports.register = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService(MongoDB.client);
    const document = await employeeService.register(req.body);

    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, "An error ocurred while creating the contact")
    );
  }
};
