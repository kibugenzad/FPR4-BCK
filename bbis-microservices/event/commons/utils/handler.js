const { CronJob } = require("cron");
const Notification = require("../../models/notification");
const Alert = require("../../models/alert");

const CRON_SCHEDULE = "0 1 * * *";
const STATUS_PENDING = "pending";
const DAY_THRESHOLD = 30;
const NOTIFICATION_SERVICE_NAME = "Notification";
const ALERT_SERVICE_NAME = "Alert";
const PAGE_SIZE = 100; // Number of documents to process at a time

const paginate = (req, data) => {
  const { page, limit } = req.body;
  const responseData = { data };

  if (page) {
    responseData.count =
      data.length < limit ? (page - 1) * limit + data.length : "many";
  }

  return responseData;
};

const alignDataResponse = (req, data, paginate) => {
  if (req.body.tag === "count") return { data };

  return req.body.page ? paginate(req, data) : data;
};

// Set up a cron job. This job runs every day at 1:00 AM.
const getLastNotifications = async (req) => {
  try {
    return await Notification.last(req, NOTIFICATION_SERVICE_NAME);
  } catch (error) {
    console.error("Error fetching last notifications:", error);
  }
};

const isLaggingBehind = (last, thirtyDaysAgo) => {
  const { body, updatedAt } = last;
  return updatedAt > body.service.processing || updatedAt < thirtyDaysAgo;
};

const addAlert = async (last) => {
  const { body, ...restOfBody } = last;
  const alertBody = {
    accounts: restOfBody,
    body,
  };

  try {
    Alert.post(alertBody, ALERT_SERVICE_NAME);
    console.log("Alert saved with body._id:", body._id);
  } catch (error) {
    console.error("Error sending alert for body._id", body._id, ":", error);
  }
};

const job = new CronJob(CRON_SCHEDULE, async () => {
  try {
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const notificationReq = {
        body: { status: STATUS_PENDING, page, limit: PAGE_SIZE },
      };
      const notifications = await getLastNotifications(notificationReq);

      // If this page has less than PAGE_SIZE documents, it's the last page.
      if (notifications.length < PAGE_SIZE) {
        hasMore = false;
      }

      notifications.forEach(async (last) => {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(
          currentDate.setDate(currentDate.getDate() - DAY_THRESHOLD)
        );

        if (isLaggingBehind(last, thirtyDaysAgo)) {
          await addAlert(last);
        }
      });

      // Move to the next page
      page++;
    }
  } catch (error) {
    console.error("Error querying database:", error);
  }
});

const handler = {
  handleRequest: async (
    actionType,
    req,
    res,
    next,
    serviceName,
    Controller
  ) => {
    try {
      const data = await Controller[actionType](req, serviceName);

      const responseData =
        actionType === "get" ? alignDataResponse(req, data, paginate) : data;

      res.send(responseData);
    } catch (error) {
      next(error);
    }
  },

  handleAlert: job,
};

module.exports = handler;
