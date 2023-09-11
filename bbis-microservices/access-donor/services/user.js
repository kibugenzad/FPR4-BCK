const Model = require("../models/user");
const config = require("../commons/config/app-config");
const { 
    filterDates,
    filterIds,
    processExactQuery 
} = require("../commons/utils/general-filters");


class User {
    static buildQuery(filters) {
        let query = { available: true };
        query = filterDates(query, filters);
        query = filterIds(query, filters);

        const exactFields = ["active", "email", "username"];
        
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

    static update(req) {
        const id = req.params.id;
        const data = req.body;  // Assuming you meant to update with body data
        return Model.findByIdAndUpdate({ _id: id }, data, { new: true });
    }

    static delete(req) {
        const id = req.params.id;
        return Model.remove({ _id: id });
    }
}

module.exports = User;
