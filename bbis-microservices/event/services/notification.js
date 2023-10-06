const Model = require("../models/notification");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
} = require("../commons/utils/general-filters");

class Notification {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["account", "user"];
    const exactFields = ["targetScreen", "title", "viewed"];

    arrayFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

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

  static last(req) {
    const { limit = config.limit, page = 0 } = req.body;

    return Model.aggregate([
      {
        $match: query,
      },
      {
        $sort: { updatedAt: -1 },
      },
      {
        $skip: page * limit,
      },
      {
        $limit: limit,
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
    ]);
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

module.exports = Notification;
