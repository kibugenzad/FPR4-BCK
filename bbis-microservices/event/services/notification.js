const Model = require("../models/notification");
const config = require("../commons/config/app-config");
const { 
    filterDates,
    filterIds,
    processExactQuery 
} = require("../commons/utils/general-filters");


class Notification {
    static buildQuery(filters) {
        let query = { available: true };  // enforce availability
        query = filterDates(query, filters);
        query = filterIds(query, filters);

        const arrayFields = ["account", "user"];
        const exactFields = ["targetScreen", "title", "viewed"];

        arrayFields.forEach(field => {
            processExactQuery(query, field, filters[field]);
        });
        
        exactFields.forEach(field => {
            processExactQuery(query, field, filters[field]);
        });

        return query;
    }

    static get(req) {
        const { limit = config.limit, page } = req.params;
        const query = this.buildQuery(req.params);

        return Model.find(query)
            .sort({ date: -1 })
            .limit(limit)
            .skip(page ? limit * (page - 1) : 0);
    }

    static create(req) {
        return Model.create(req.body);
    }

    static update(req) {
        const { id } = req.params;
        return Model.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    }

    static delete(req) {
        const { id } = req.params;
        return Model.remove({ _id: id });
    }
}

module.exports = Notification;
