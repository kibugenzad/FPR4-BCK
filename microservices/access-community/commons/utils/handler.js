const paginate = (page, limit, data) => {
  const responseData = { data };

  if (page) {
    responseData.count =
      data.length < limit ? (page - 1) * limit + data.length : "many";
  }

  return responseData;
};

const alignDataResponse = (req, data, paginate) => {
  const { limit, page, tag } = { ...req.params, ...req.body };
  if (tag === "count") return { data };

  return page && limit ? paginate(page, limit, data) : data;
};

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

      console.log("responseData", data);

      res.send(responseData);
    } catch (error) {
      next(error);
    }
  },

  handleAuthentication: async (
    actionType,
    req,
    res,
    next,
    serviceName,
    Controller
  ) => {
    try {
      const responseData = await Controller[actionType](req, serviceName);
      res.send(responseData);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = handler;
