module.exports = {
  limit: 10,
  nonProtectedRoutes: {
    get: ["serviceCategory", "service"],
    post: ["contactUs"],
  },
  apiPrefix: "/api",
  secret: "aSZxKA2l8sJnfA4P",
  whitelistedUrls: [
    "/api/access/authentication/superadmin",
    "/api/access/authentication/superuser",
    "/api/access/authentication/account",
    "/api/access/authentication/user",
  ],
};
