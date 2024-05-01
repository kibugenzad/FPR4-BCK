const schedule = require("node-schedule"); // If you're using node-schedule for scheduling
const account = require("../../models/account");
const eventEmitter = require("../event/eventEmitter");
const notification = require("../../models/notification");
const postModel = require("../../models/post");
const accessRole = require("../../models/access-role");
const sendEmail = require("../utils/send-email");
const community = require("../../models/community");
const communityMembership = require("../../models/community-member");
const commentModel = require("../../models/comment");
const likePost = require("../../models/likePost");
const likeComment = require("../../models/likeComment");
const { ObjectId } = require("mongoose").Types;

schedule.scheduleJob("* * * * * *", async () => {});

eventEmitter.on("friend-request", async (data) => {
  try {
    const { user, friendRequest } = data;
    const { status, requester, requestee } = friendRequest;

    let notificationMessage = "";

    if (status === "pending") {
      notificationMessage = `[${requester.firstName} ${requester.lastName}] sent a friend request`;

      //send notification
      await notification.create({
        user: requestee._id,
        message: notificationMessage,
        type: "friend-request-pending",
        read: 0,
        date: Date.now(),
      });

      return;
    }

    if (status === "accepted") {
      if (requestee && user === requestee._id.toString()) {
        //followed update
        await account.findByIdAndUpdate(
          {
            _id: user,
          },
          { $inc: { follower: 1 } }
        );

        //follower update
        await account.findByIdAndUpdate(
          {
            _id: requester._id,
          },
          { $inc: { following: 1 } }
        );

        notificationMessage = `your are now following [${requestee.firstName} ${requestee.lastName}]`;

        //send notification
        await notification.create({
          user: requester._id,
          message: notificationMessage,
          type: "friend-request-accepted",
          read: 0,
          date: Date.now(),
        });
      }
    }
  } catch (error) {
    console.log("New Notification Error", error);
  }
});

eventEmitter.on("create-comment", async (data) => {
  const { post, postOwner, commentOwner, message } = data;

  let notificationMessage = `[${commentOwner.firstName} ${commentOwner.lastName}] commented [${message}]`;

  await postModel.findByIdAndUpdate(
    { _id: post },
    { $inc: { comments: 1 } },
    { new: true }
  );

  //send notification
  await notification.create({
    user: postOwner,
    message: notificationMessage,
    type: "comment",
    read: 0,
    date: Date.now(),
  });
});

eventEmitter.on("delete-comment", async (data) => {
  const { post } = data;

  await postModel.findByIdAndUpdate(
    { _id: post },
    { $inc: { comments: -1 } },
    { new: true }
  );
});

eventEmitter.on("create-account", async (data) => {
  const { _id, email, firstName, lastName, category } = data;

  // await new sendEmail({
  //   name: firstName + " " + lastName,
  // }).sendWelcome();

  const accessRoleData = await accessRole.find({ default: true });

  if (accessRoleData.length > 0) {
    const formateAccessRole = accessRoleData.map((el) => el._id);

    await account.findByIdAndUpdate(
      {
        _id,
      },
      {
        accessRole: formateAccessRole,
      }
    );
  }

  //join public communities in your audience

  const communityData = await community.find({
    audience: category,
    category: "public",
  });
  communityData.map((el) => {
    //create membership
    communityMembership.create({
      user: _id,
      community: el._id,
    });
  });
});

eventEmitter.on("like-post", async (data) => {
  const { post, postOwner, likeOwner } = data;

  let notificationMessage = `[${likeOwner.firstName} ${
    likeOwner.lastName
  }] liked your post ${post.content !== "" ? post.content : post.file}`;

  await postModel.findByIdAndUpdate(
    { _id: post._id },
    { $inc: { likes: 1 } },
    { new: true }
  );

  //send notification
  await notification.create({
    user: postOwner,
    message: notificationMessage,
    type: "like-post",
    read: 0,
    date: Date.now(),
  });
});

eventEmitter.on("unlike-post", async (data) => {
  const { id, post } = data;

  await postModel.findByIdAndUpdate(
    { _id: post },
    { $inc: { likes: -1 } },
    { new: true }
  );

  await likePost.findByIdAndDelete({ _id: id });
});

eventEmitter.on("like-comment", async (data) => {
  const { comment, commentOwner, likeOwner } = data;

  let notificationMessage = `[${likeOwner.firstName} ${
    likeOwner.lastName
  }] liked your comment ${
    comment.content !== "" ? comment.content : post.file
  }`;

  await commentModel.findByIdAndUpdate(
    { _id: comment._id },
    { $inc: { likes: 1 } },
    { new: true }
  );

  //send notification
  await notification.create({
    user: commentOwner,
    message: notificationMessage,
    type: "like-comment",
    read: 0,
    date: Date.now(),
  });
});

eventEmitter.on("unlike-comment", async (data) => {
  const { comment } = data;

  await commentModel.findByIdAndUpdate(
    { _id: comment },
    { $inc: { likes: -1 } },
    { new: true }
  );

  await likeComment.findByIdAndDelete({ _id: comment });
});

eventEmitter.on("create-community", async (data) => {
  const { user, community } = data;

  communityMembership.create({
    user,
    community,
  });
});
