module.exports = {
  limit: 50,
  nonProtectedRoutes: {
    get: ["serviceCategory", "service"],
    post: ["contactUs"],
  },
  apiPrefix: "/api",
  secret: "aSZxKA2l8sJnfA4P",
  whitelistedUrls: [
    // should be updated to reflect event
    "/api/access/authentication/superadmin",
    "/api/access/authentication/superuser",
    "/api/access/authentication/account",
    "/api/access/authentication/user",
  ],
  authUrls: [
    // should be updated to reflect event
    "/api/access/authentication/superadmin",
    "/api/access/authentication/superuser",
    "/api/access/authentication/account",
    "/api/access/authentication/user",
  ],
  notificationUrl: [
    // should be updated to reflect event
    "/api/event/notification",
  ],
};
