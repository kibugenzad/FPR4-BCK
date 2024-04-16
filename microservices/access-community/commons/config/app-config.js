module.exports = {
  limit: 50,
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
  ],
  authUrls: [
    "/api/access/authentication/superadmin",
    "/api/access/authentication/account",
  ],
  userWhitelistedPaths: ["/api/access/superAdmin"],
  adminRoles: ["superAdmin", "account"],
  superAdminRoles: ["superAdmin"],
  userRoles: ["user"],
  restrictRequestRoles: ["account"],
};
