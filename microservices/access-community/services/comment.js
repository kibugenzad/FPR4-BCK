const Model = require("../models/comment");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");

class Comment {
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
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const commentData = await Model.create(req.body);

    const commentInfo = await Model.findById({ _id: commentData._id })
      .populate({ path: "owner" })
      .populate({ path: "post" });

    eventEmitter.emit("create-comment", {
      post: commentData.post._id,
      postOwner: commentInfo.post.owner,
      commentOwner: commentInfo.owner,
      message: commentData.content,
    });

    return commentInfo;
  }

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static async delete(req) {
    const { id } = req.body;

    const commentData = await Model.findById({ _id: id });

    Model.findByIdAndDelete({ _id: id });

    eventEmitter.emit("delete-comment", {
      post: commentData.post,
    });

    return "deleted";
  }
}

module.exports = Comment;
