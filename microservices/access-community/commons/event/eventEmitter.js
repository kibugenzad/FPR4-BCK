const EventEmitter = require('events');
const schedule = require('node-schedule');

class MyEmitter extends EventEmitter {
    constructor() {
        super();
        this.schedule = schedule;
    }

    scheduleJob(date, callback) {
        return this.schedule.scheduleJob(date, callback);
    }

    cancelJob(job) {
        job.cancel();
    }

}

module.exports = new MyEmitter();


