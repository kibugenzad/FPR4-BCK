const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Model = require("../models/donor");
const config = require("../commons/config/app-config");
const {
  filterDates,
  filterIds,
  processExactQuery,
} = require("../commons/utils/general-filters");
const eventEmitter = require("../commons/event/eventEmitter");

class Donor {
  static buildQuery(filters) {
    let query = { available: true };
    query = filterDates(query, filters);
    query = filterIds(query, filters);

    const exactFields = ["active", "email", "username", "pin", "donorNumber","lastName","center","centerSite","identityDocNumber","_id"];

    exactFields.forEach((field) => {
      processExactQuery(query, field, filters[field]);
    });

    return query;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static get(req) {
    const { limit = config.limit, page ,sortField = 'createdAt', sortOrder = '-1'} = req.body;
    const query = this.buildQuery(req.body);


    
    
    const sort = {[sortField]: sortOrder} 

    return Model.find(query)
      .populate({ path: "accessRole" })
      .select(["-password"])
      .populate({ path: "center" })
      .populate({ path: "centerSite" })
      .sort(sort)
      .limit(limit)
      .skip(page ? limit * (page - 1) : 0);
  }

  static async create(req) {
    const userData = req.body;

    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    if (userData.passcode) {
      userData.passcode = await this.hashPassword(userData.passcode);
    }

    const donor = await Model.create(userData);
     
    eventEmitter.emit("accountCreated", userData);

    return donor;
  }

  static update(req) {
    const id = req.params.id || req.body.id;
    const data = req.body; // Assuming you meant to update with body data
    return Model.findByIdAndUpdate(id, data, { new: true });
  }

  static delete(req) {
    const id = req.params.id || req.body.id;
    console.log({id:id})
    return Model.remove({ _id: id });
  }

  static async authenticate(req) {
    const { email, password, passcode } = req.body;
    const user = await Model.findOne({ email: email })
      .populate({ path: "accessRole" })
      .select("+password");

    if (!user) {
      return {
        status: "error",
        message: "Authentication failed! Wrong username or password.",
      };
    }

    const match = await bcrypt.compare(
      password || passcode,
      user.password || user.passcode
    );

    if (match) {
      let token = jwt.sign(
        { id: user._id, position: user.position, account_type: "donor" },
        config.secret,
        { expiresIn: 60 * 60 * 24 }
      ); // 24 hours
      let resp = {
        id: user._id,
        account_type: "donor",
        donorNumber: user.donorNumber,
        success: true,
        token: token,
        username: user.username,
        name: user.name,
        contact: user.contact,
        accessRole: user.accessRole,
      };
      return resp;
    } else {
      return {
        status: "error",
        message: "Authentication failed! Wrong username or password.",
      };
    }
  }

  // block/unblock donor
  static async block(req) {
    const { id,blockReason,blockType } = req.body;
    const donor = await Model.findById(id);
    let data;
    const blockInfo = donor.blockInfo;
    if(blockInfo.blocked === true){
       data = {blockInfo:{ blocked: false, blockReason, blockType }};
    }else{
      data = {blockInfo:{ blocked: true, blockReason, blockType }};
    }
    return Model.findByIdAndUpdate(id, data, { new: true });
  }


    

  

}

module.exports = Donor;
