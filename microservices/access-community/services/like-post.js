const Model = require("../models/likePost");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");

class LikePost {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["post"];
    const exactFields = ["owner"];

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
    } = req.body;
    const query = this.buildQuery(req.body);

    const sort = { [sortField]: sortOrder };

    return Model.find(query)
      .populate({ path: "owner" })
      .populate({ path: "post" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const ownerLiked = await Model.find({ owner: req.body.owner });

    if (ownerLiked.length > 0) {
      const likeData = await Model.findById({ _id: ownerLiked[0]._id });

      eventEmitter.emit("unlike-post", {
        id: likeData._id,
        post: likeData.post,
      });

      return "un-liked post successfully ";
    }

    const likeData = await Model.create(req.body);

    const savedInfo = await Model.findById({ _id: likeData._id })
      .populate({ path: "owner" })
      .populate({ path: "post" });

    eventEmitter.emit("like-post", {
      post: savedInfo.post,
      postOwner: savedInfo.post.owner,
      likeOwner: savedInfo.owner,
    });

    return "Liked post successfully ";
  }

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static async delete(req) {
    const { id } = req.body;

    const likeData = await Model.findById({ _id: id });

    Model.findByIdAndDelete({ _id: id });

    eventEmitter.emit("unlike-post", {
      id: likeData._id,
      post: likeData.post,
    });

    return "un-liked post successfully ";
  }
}

module.exports = LikePost;
