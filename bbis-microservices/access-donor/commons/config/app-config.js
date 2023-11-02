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
    "/api/access/authentication/user",
    "/api/access/service",
    "/api/access/ippis",
    "/api/access/ippis/user/signup",
  ],
  authUrls: [
    "/api/access/authentication/superadmin",
    "/api/access/authentication/superuser",
    "/api/access/authentication/account",
    "/api/access/authentication/user",
  ],
  userWhitelistedPaths: [
    "/api/access/authentication/user",
    "/api/access/request",
    "/api/access/service",
  ],
  adminRoles: ["superAdmin", "superUser", "account"],
  superAdminRoles: ["superAdmin", "superUser"],
  userRoles: ["user"],
  restrictRequestRoles: ["account", "donor"],
  donationUrl: ["/api/access/bloodDonation"],
};
