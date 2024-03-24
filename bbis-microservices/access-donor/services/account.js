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

class Account {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["department"];
    const exactFields = ["active", "email", "username", "outsideOrganization"];

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
    const { limit = config.limit, page,  sortField = 'createdAt', sortOrder = '-1'  } = req.body;
    const query = this.buildQuery(req.body);
    
      
    const sort = {[sortField]: sortOrder} 

    return Model.find(query)
      .populate({ path: "accessRole" })
      .populate({ path: "department" })
      .populate({ path: "position" })
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

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static delete(req) {
    const { id } = req.body;
    return Model.remove({ _id: id });
  }

  static async authenticate(req) {
    const { email, password, passcode } = req.body;
    const user = await Model.findOne({ email: email })
      .populate({ path: "accessRole" })
      .select("+password +passcode");

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
      let token = generateToken(
        {
          id: user._id,
          position: user.position,
          institution: user.institution,
          accessRoleId: user.accessRole._id,
          accountType: user.outsideOrganization
            ? "acount-subApprover"
            : "account",
        }
      );
      let resp = {
        success: true,
        token: token,
        id: user._id,
        username: user.username,
        name: user.name,
        contact: user.contact,
        accessRole: user.accessRole,
        pin: user.pin,
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
