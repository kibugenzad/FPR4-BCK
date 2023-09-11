const Model = require("../models/super-admin");
const config = require("../commons/config/app-config");
const { 
    filterDates,
    filterIds,
    processExactQuery 
} = require("../commons/utils/general-filters");


class SuperAdmin {
    static buildQuery(filters) {
        let query = {};
        query = filterDates(query, filters);
        query = filterIds(query, filters);

        const exactFields = ["email", "username"];
        
        exactFields.forEach(field => {
            processExactQuery(query, field, filters[field]);
        });

        return query;
    }

    static get(req) {
        const { limit = config.limit, page } = req.params;
        const query = this.buildQuery(req.params);

        return Model.find(query)
            .populate({ path: "accessRole" })
            .select(["-password"])
            .sort({ date: -1 })
            .limit(limit)
            .skip(page ? limit * (page - 1) : 0);
    }

    static create(req) {
        return Model.create(req.body);
    }
}

module.exports = SuperAdmin;
