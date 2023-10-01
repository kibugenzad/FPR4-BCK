const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Model = require("../models/donor");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
} = require("../commons/utils/general-filters");

class Donor {
  static buildQuery(filters) {
    let query = { available: true };
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const exactFields = ["active", "email", "username"];

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
    const { limit = config.limit, page } = req.body;
    const query = this.buildQuery(req.body);

    return Model.find(query)
      .populate({ path: "accessRole" })
      .select(["-password"])
      .sort({ date: -1 })
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

  static update(req) {
    const id = req.params.id;
    const data = req.body; // Assuming you meant to update with body data
    return Model.findByIdAndUpdate({ _id: id }, data, { new: true });
  }

  static delete(req) {
    const id = req.params.id;
    return Model.remove({ _id: id });
  }

  static async authenticate(req) {
    const { email, password, passcode } = req.body;
    const user = await Model.findOne({ email: email })
      .populate({ path: "accessRole" })
      .select("+password");

    if (!user) {
      return {
        status: "error",
        message: "Authentication failed! Wrong username or password.",
      };
    }

    const match = await bcrypt.compare(
      password || passcode,
      user.password || user.passcode
    );

    if (match) {
      let token = jwt.sign(
        { id: user._id, account_type: "superUser" },
        config.secret,
        { expiresIn: 60 * 60 * 24 }
      ); // 24 hours
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

module.exports = Donor;
