const Model = require("../models/pre-donation-assessment");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");

class PreDonationAssessment {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["department", "service", "donor"];
    const exactFields = ["name"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static get(req) {
    const { limit = config.limit, page,  sortField = 'createdAt', sortOrder = '-1'  } = req.body;
    const query = this.buildQuery(req.body);
    
    
     const sort = {};
    sort[sortField] = sortOrder; 

    return Model.find(query)
      .populate({ path: "questionnaire" })
      .populate({ path: "assessedBy" })
      .populate({ path: "donor", 
        populate: [
          { path: "center" },
          { path: "centerSite" }
        ]
      })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
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
}

module.exports = PreDonationAssessment;
