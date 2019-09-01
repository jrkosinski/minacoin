'use strict';

/**
 * ------------------------
 * simple homemade IOC container to serve our purposes.
 *
 * Author: John R. Kosinski
 * Date: 27 Aug 2019
 */

class Container {
    constructor() {
        this.services = {};
    }

    /**
     * register a service by name, with the IOC container
     *
     * @param {string} serviceName
     * @param {fn} callback
     */
    service(serviceName, callback) {
        Object.defineProperty(this, serviceName, {
            get: () => {
                if (!this.services.hasOwnProperty(serviceName)) {
                    this.services[serviceName] = callback(this);
                }
                return this.services[serviceName];
            },
            configurable: true,
            enumerable: true
        });

        return this;
    }
}

//export singleton instance
const container = new Container();
module.exports = container;