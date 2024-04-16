const Model = require("../models/friend-request");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");
const decodeToken = require("../commons/utils/decodeToken");

class FriendRequest {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = [];
    const exactFields = ["user", "read"];

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
      sortOrder = "-1",
    } = req.body;
    const query = this.buildQuery(req.body);

    const sort = { [sortField]: sortOrder };

    return Model.find(query)
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const createdData = await Model.create(req.body);
    const token = req.headers.authorization;
    const { id: user } = decodeToken(token);

    const friendRequestInfo = await Model.findOne({ _id: createdData._id })
      .populate({ path: "requester" })
      .populate({ path: "requestee" });

    eventEmitter.emit("friend-request", {
      friendRequest: friendRequestInfo,
      user: user,
    });

    return friendRequestInfo;
  }

  static async update(req) {
    const { id, status } = req.body;

    const token = req.headers.authorization;
    const { id: user } = decodeToken(token);

    await Model.findByIdAndUpdate(id, { status }, { new: true });

    const friendRequestInfo = await Model.findOne({ _id: id })
      .populate({ path: "requester" })
      .populate({ path: "requestee" });

    eventEmitter.emit("friend-request", {
      friendRequest: friendRequestInfo,
      status,
      user: user,
    });
    return friendRequestInfo;
  }

  static delete(req) {
    const { id } = req.body;
    returnModel.findByIdAndDelete({ _id: id });
  }
}

module.exports = FriendRequest;
