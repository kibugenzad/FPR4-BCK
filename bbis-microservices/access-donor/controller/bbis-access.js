/*
Access controller
handles all actions with
the services
*/

const Services = require("../services");

/*
Controller
*/
class BBISAccess {
  static performAction(action, req, serviceName) {
    // Validate the service name
    const Service = Services[serviceName];
    if (!Service) {
      throw new Error(`Invalid service name: ${serviceName}`);
    }

    // Perform the action
    return Service[action](req);
  }

  static get(req, serviceName) {
    return this.performAction("get", req, serviceName);
  }

  static post(req, serviceName) {
    return this.performAction("create", req, serviceName);
  }

  static put(req, serviceName) {
    return this.performAction("update", req, serviceName);
  }

  static delete(req, serviceName) {
    return this.performAction("delete", req, serviceName);
  }

  static block(req, serviceName) {
    return this.performAction("block", req, serviceName);
  }

  static countByDonor(req, serviceName) {
    return this.performAction("countByDonor", req, serviceName);
  }

  // club
  static addMember(req, serviceName) {
    return this.performAction("addMember", req, serviceName);
  }

  static removeMember(req, serviceName) {
    return this.performAction("removeMember", req, serviceName);
  }
  

  static authenticate(req, serviceName) {
    if (!req.body.password) {
      throw new Error("No password provided in the request");
    }
    return this.performAction("authenticate", req, serviceName);
  }
}

module.exports = BBISAccess;
