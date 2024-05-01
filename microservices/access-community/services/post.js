const Model = require("../models/post");
const CommunityMembership = require("../models/community-member");
const FriendRequest = require("../models/friend-request");
const LikePost = require("../models/likePost");
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

    const arrayFields = ["community", "owner"];
    const exactFields = ["owner", "_id"];

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

    const likes = await LikePost.find();

    const listPostData = await Model.find(query)
      .populate({ path: "owner" })
      .populate({ path: "community" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);

    const data = await Promise.all(
      listPostData.map(async (el) => {
        const likes = await LikePost.find({ post: el._id });

        console.log("didieliked", likes);

        if (likes.length > 0) {
          return {
            ...el._doc,
            liked: true,
          };
        }

        return el;
      })
    );

    return data;
  }

  // static async getLatestPosts(req) {
  //   const {
  //     limit = config.limit,
  //     page,
  //     sortField = "createdAt",
  //     sortOrder = -1,
  //   } = req.body;

  //   const sort = { [sortField]: sortOrder };

  //   const token = req.headers.authorization;
  //   const { id: user } = decodeToken(token);

  //   const userCommunities = await CommunityMembership.find({ user });
  //   const communityIds = userCommunities.map((el) => el.community);

  //   // Find posts from user's communities
  //   const communityPosts = await Model.find({
  //     community: { $in: communityIds },
  //   })
  //     .populate("owner")
  //     .populate("community")
  //     .sort(sort)
  //     .limit(limit)
  //     .skip(page ? limit * (page - 1) : 0);

  //   return communityPosts;
  // }

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
