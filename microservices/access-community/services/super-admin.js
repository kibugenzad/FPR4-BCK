const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Model = require("../models/super-admin");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
} = require("../commons/utils/general-filters");
const generateToken = require("../commons/utils/generateToken");

class SuperAdmin {
  static buildQuery(filters) {
    let query = {};
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const exactFields = ["email", "username"];

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static get(req) {
    const {
      limit = config.limit,
      page,
      sortField = "createdAt",
      sortOrder = "-1",
    } = req.body;
    const query = this.buildQuery(req.body);

    const sort = { [sortField]: sortOrder };

    return Model.find(query)
      .select(["-password"])
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const userData = req.body;

    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    if (userData.passcode) {
      userData.passcode = await this.hashPassword(userData.passcode);
    }

    return Model.create(userData);
  }

  static async authenticate(req) {
    const { email, password } = req.body;
    const user = await Model.findOne({ email: email }).select("+password");

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
        accountType: "superAdmin",
      });
      let resp = {
        success: true,
        token: token,
        username: user.username,
        name: user.name,
        contact: user.contact,
        accessRole: user.accessRole,
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

module.exports = SuperAdmin;
