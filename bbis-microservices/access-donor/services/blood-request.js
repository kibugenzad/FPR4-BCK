const Model = require("../models/blood-request");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");

class BloodRequest {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["hospital", "bloodDistributor"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    return query;
  }

  static get(req) {
    const { limit = config.limit, page } = req.body;
    const query = this.buildQuery(req.body);

    return Model.find(query)
      .populate({ path: "approvals.account" })
      .populate({ path: "linkedEntity.distributor" })
      .populate({ path: "donor" })
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
    return Model.remove({ _id: id });
  }
}

module.exports = BloodRequest;
