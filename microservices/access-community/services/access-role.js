const Model = require("../models/access-role");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
} = require("../commons/utils/general-filters");

class AccessRole {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const exactFields = ["name"];

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static get(req) {
    const { limit = config.limit, page } = req.body;
    const query = this.buildQuery(req.body);

    return Model.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static create(req) {
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

module.exports = AccessRole;
