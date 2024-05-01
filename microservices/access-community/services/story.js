const Model = require("../models/story");
const decodeToken = require("../commons/utils/decodeToken");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");

class Post {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["owner"];
    const exactFields = ["owner", "_id"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static get(req) {
    const {
      limit = config.limit,
      page,
      sortField = "createdAt",
      sortOrder = -1,
    } = req.query;
    const query = this.buildQuery(req.query);

    console.log("querydidier", query);

    const sort = { [sortField]: sortOrder };

    return Model.find(query)
      .populate({ path: "owner" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static create(req) {
    const token = req.headers.authorization;
    const { id: user } = decodeToken(token);

    req.body.owner = user;

    return Model.create(req.body);
  }

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static delete(req) {
    const { id } = req.body;
    returnModel.findByIdAndDelete({ _id: id });
  }
}

module.exports = Post;
