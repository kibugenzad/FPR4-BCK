const Model = require("../models/club");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");

class Club {
    static buildQuery(filters) {
        let query = { available: true }; // enforce availability
        query = filterDates(query, filters);
        query = filterIds(query, filters);
    
        const exactFields = ["name", "donationNumber", "members"];
    
        exactFields.forEach((field) => {
        processExactQuery(query, field, filters[field]);
        });
    
        return query;
    }
    
    static get(req) {
        const { limit = config.limit, page,sortField = 'createdAt', sortOrder = '-1' } = req.body;
        const query = this.buildQuery(req.body);
         
        const sort = {};
        
        sort[sortField] = sortOrder; 
    
        return (
        Model.find(query)
        .populate({ path: "members" })
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
        const { id, member } = req.body;
        return Model.findByIdAndUpdate(id, { $addToSet: { members: member } }, { new: true });

    }

    static removeMember(req) {
        const { id, member } = req.body;
        return Model.findByIdAndUpdate(id, { $pull: { members: member } }, { new: true });
    }

    }

module.exports = Club;