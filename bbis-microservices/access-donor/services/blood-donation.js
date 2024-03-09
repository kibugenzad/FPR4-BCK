const Model = require("../models/blood-donation");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processArrayQuery,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");

class BloodDonation {
  static buildQuery(filters) {
    let query = { available: true }; // enforce availability
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const arrayFields = ["donor", "bloodSite", "bloodCenter"];
    const exactFields = ["donorNumber"];

    arrayFields.forEach((field) => {
      processArrayQuery(query, field, filters[field]);
    });

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static get(req) {
    const {
      limit = config.limit,
      page,
      sortField = "createdAt",
      sortOrder = "-1",
    } = req.body;
    const query = this.buildQuery(req.body);

    
    const sort = {[sortField]: sortOrder}

    return (
      Model.find(query)
        // .populate({ path: "bloodInfo" })
        .populate({ path: "center" })
        .populate({ path: "centerSite" })
        .populate({ path: "donor" })
        // .populate({ path: "collectedBy" })
        .sort(sort)
        .limit(limit)
        .skip(page ? limit * (page - 1) : 0)
    );
  }

  static async create(req) {
    const data = req.body;
    const { donor } = data;
    const donation = await Model.create(data);
    eventEmitter.emit("donationCreated", { donor });

    return donation;
  }

  static update(req) {
    const { id } = req.body;
    return Model.findByIdAndUpdate(id, req.body, { new: true });
  }

  static delete(req) {
    const { id } = req.body;
    return Model.remove({ _id: id });
  }

  //count number of donations made by a donor
  static countByDonor(req) {
    const { donorId } = req.params;
    const count =  Model.countDocuments({ donor: donorId })
  
    return  count  ;
  }
}

module.exports = BloodDonation;
