const Model = require("../models/community");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");
const decodeToken = require("../commons/utils/decodeToken");
const communityMember = require("../models/community-member");

class Community {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["address", "audience"];
    const exactFields = ["category", "category"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static async get(req) {
    const {
      limit = config.limit,
      page,
      sortField = "createdAt",
      sortOrder = -1,
    } = req.body;
    const query = this.buildQuery(req.body);

    const sort = { [sortField]: sortOrder };

    const token = req.headers.authorization;
    const { id: user } = decodeToken(token);

    const myCommunities = await communityMember.find({ user });

    const listCommunities = await Model.find(query)
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);

    const data = listCommunities.map((el) => {
      const findCommunity = myCommunities.find(
        (mel) => mel.community + "" === el._id + ""
      );

      if (findCommunity) {
        return {
          ...el._doc,
          membership: "joined",
          membershipDate: findCommunity.createdAt,
        };
      }

      return el;
    });

    return data;
  }

  static async create(req) {
    const token = req.headers.authorization;
    const { id: user } = decodeToken(token);

    const dataInfo = await Model.create(req.body);

    eventEmitter.emit("create-community", {
      community: dataInfo._id,
      user: user,
    });

    return dataInfo;
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

module.exports = Community;
