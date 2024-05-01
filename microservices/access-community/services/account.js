const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Model = require("../models/account");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
  processArrayQuery,
} = require("../commons/utils/general-filters");
const generateToken = require("../commons/utils/generateToken");
const eventEmitter = require("../commons/event/eventEmitter");

class Account {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["department"];
    const exactFields = ["active", "email", "phoneNumber", "address"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      error.message = `Password hashing failed! ${error.message}`;
      throw error;
    }
  }

  static get(req) {
    const {
      limit = config.limit,
      page,
      sortField = "createdAt",
      sortOrder = -1,
    } = req.body;
    const query = this.buildQuery(req.body);

    const sort = { [sortField]: sortOrder };

    return Model.find(query)
      .populate({ path: "accessRole" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const userData = req.body;

    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    const createdData = await Model.create(userData);

    eventEmitter.emit("create-account", createdData);

    return createdData;
  }

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static delete(req) {
    const { id } = req.body;
    returnModel.findByIdAndDelete({ _id: id });
  }

  static async authenticate(req) {
    const { email, password } = req.body;
    const user = await Model.findOne({ email: email })
      .populate({ path: "accessRole" })
      .select("+password");

    if (!user) {
      return {
        status: "error",
        message: "Authentication failed! Wrong username or password.",
      };
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      let token = generateToken({
        id: user._id,
        address: user.address,
        accessRoleId: user.accessRole,
      });
      let resp = {
        success: true,
        token: token,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        accessRole: user.accessRole,
        category: user.category,
        registrationLevel: user.registrationLevel,
      };
      return resp;
    } else {
      return {
        status: "error",
        message: "Authentication failed! Wrong username or password.",
      };
    }
  }
}

module.exports = Account;
