const Model = require("../models/club-member");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");

class ClubMember {

    static buildQuery(filters) {
        let query = { available: true }; // enforce availability
        query = filterDates(query, filters);
        query = filterIds(query, filters);
    
        const exactFields = ["donor", "club"];
    
        exactFields.forEach((field) => {
        processExactQuery(query, field, filters[field]);
        });
    
        return query;
    }
    
    static get(req) {
        const { limit = config.limit, page, sortField = 'createdAt', sortOrder = '-1' } = req.body;
        const query = this.buildQuery(req.body);

        const sort = {[sortField]: sortOrder} 
    
        return (
        Model.find(query)
            .sort(sort)
            .limit(limit)
            .skip(page ? limit * (page - 1) : 0)
        );
    }
    
    static create(req) {
        return Model.create(req.body);
    }
    
    static update(req) {
        const { id } = req.body;
        return Model.findByIdAndUpdate(id, req.body, { new: true });
    }
    
    static delete(req) {
        const { id } = req.body;
        return Model.remove({ _id: id });
    }
    
    static addMember(req) {
        const { donor, club } = req.body;
        return Model.create({ donor, club });
    }
    
    static removeMember(req) {
        const { donor, club } = req.body;
        return Model.remove({ donor, club });
    }

    }


module.exports = ClubMember;

