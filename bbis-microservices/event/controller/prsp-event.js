/*
Access controller
handles all actions with
the services
*/

const Services = require("../services");


/*
Controller
*/
class bbisEvent {
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

    static create(req, serviceName) {
        return this.performAction("create", req, serviceName);
    }

    static update(req, serviceName) {
        return this.performAction("update", req, serviceName);
    }

    static delete(req, serviceName) {
        return this.performAction("delete", req, serviceName);
    }
}

module.exports = bbisEvent;
