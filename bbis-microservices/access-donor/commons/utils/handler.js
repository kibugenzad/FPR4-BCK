const paginate = (req, data) => {
    const { page, limit } = req.body;
    const responseData = { data };
    
    if (page) {
        responseData.count = data.length < limit 
            ? ((page - 1) * limit) + data.length 
            : "many";
    }

    return responseData;
};

const alignDataResponse = (req, data, paginate) => {
    if (req.body.tag === "count") return { data };

    return req.body.page ? paginate(req, data) : data;
};

const handler = {
    handleRequest: async (actionType, req, res, next, serviceName, Controller) => {
        try {
            const data = await Controller[actionType](req, serviceName);
            
            const responseData = actionType === "get" 
                ? alignDataResponse(req, data, paginate) 
                : data;

            res.send(responseData);

        } catch (error) {
            next(error);
        }
    }
};
  
module.exports = handler;
