const Model = require("../models/pre-donation-assessment");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");
class PreDonationAssessment {
  static buildQuery(filters) {
    console.log("filters", filters);
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
  
    for (const key in filters) {
      if (key=== 'decodedToken'||key === 'limit' || key === 'page' || key === 'sortField' || key === 'sortOrder') continue;
     query[key] = filters[key];
    };

    // id 
    if (filters.id) {
      query['_id'] = filters.id;
      // remove id from query
      delete query.id;
    }
    return query;
  }

  static get(req) {
    const { limit = config.limit, page,  sortField = 'createdAt', sortOrder = '-1'  } = req.body;
    const query = this.buildQuery(req.body);
    
    
     
    const sort = {[sortField]: sortOrder} 

    return Model.find(query)
      .populate({ path: "questionnaire" })
      .populate({ path: "assessedBy" })
      .populate({ path: "center" })
      .populate({ path: "centerSite" })
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

  static async create(req) {
    const data = req.body;
    const assessment = await Model.create(data);
    eventEmitter.emit("donationAppointmentCreated", { assessment });
    return assessment;
  }

  static async update(req) {
    const { id } = req.body;
    const updatedData=await Model.findByIdAndUpdate(id, req.body, { new: true });
    if(updatedData.status!=='pending'){
      eventEmitter.emit("donationAppointmentApproved", { assessment:updatedData });
    }
    return  updatedData;
  }

  static delete(req) {
    const { id } = req.body;
    return Model.remove({ _id: id });
  }
}

module.exports = PreDonationAssessment;
