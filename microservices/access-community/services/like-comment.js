const Model = require("../models/likeComment");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");

class LikeComment {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["comment"];
    const exactFields = ["owner", "comment"];

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
      .populate({ path: "comment" })
      .populate({ path: "owner" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const ownerComment = await Model.find({ owner: req.body.owner });

    if (ownerComment.length > 0) {
      const commentData = await Model.findById({ _id: ownerComment[0]._id });

      eventEmitter.emit("unlike-comment", {
        id: commentData._id,
        comment: commentData.comment,
      });

      return "un-liked comment successfully ";
    }

    const likeData = await Model.create(req.body);

    const savedInfo = await Model.findById({ _id: likeData._id })
      .populate({ path: "owner" })
      .populate({ path: "comment" });

    eventEmitter.emit("like-comment", {
      comment: savedInfo.comment,
      commentOwner: savedInfo.comment.owner,
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

    eventEmitter("unlike-comment", {
      id: likeData._id,
      comment: likeData.comment,
    });

    return;
  }
}

module.exports = LikeComment;
