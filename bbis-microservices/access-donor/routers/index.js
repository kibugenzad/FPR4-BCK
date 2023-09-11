/*
all services
*/

const AccessRole = require("./access-role"),
Account = require("./account"),
BloodCenterSite = require("./blood-center-site"),
BloodCenter = require("./blood-center"),
BloodDistributor = require("./blood-distributor"),
BloodDonationCampaign = require("./blood-campaign"),
BloodDonationCommitee = require("./blood-donation-commitee"),
BloodDonation = require("./blood-donation"),
BloodRequest = require("./blood-request"),
BloodTest = require("./blood-test"),
BloodUsage = require("./blood-usage"),
Donor = require("./donor"),
Hospital = require("./hospital"),
ServiceCategory = require("./service-category"),
Department = require("./department"),
Position = require("./position"),
BloodRequest = require("./request"),
Service = require("./service"),
SuperAdmin = require("./super-admin"),
SuperUser = require("./super-user"),
User = require("./user");

modules.exports = {
    AccessRole,
    Account,
    BloodCenterSite,
    BloodCenter,
    BloodDistributor,
    BloodDonationCampaign,
    BloodDonationCommitee,
    BloodDonation,
    BloodRequest,
    BloodTest,
    BloodUsage,
    Donor,
    Hospital,
    ServiceCategory,
    Department,
    Position,
    Service,
    SuperAdmin,
    SuperUser,
    User,
}