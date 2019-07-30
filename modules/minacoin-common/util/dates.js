'use strict'; 

//TODO: on diff and conversion methods, detect & convert between unix & regular timestamps (LOW)

// ===============================================================================================
// dates 
// Utilities for handling dates and unix timestamps.
// 
// John R. Kosinski
// 13 Jan 2018

Date.prototype.toUnixTimestamp = () => {
    return Math.floor(this.getTime()/1000);
}

/**
 * converts timestamp to string 
 * @param {int} timestamp 
 * @returns {string}
 */
/*string*/ function toDateString(timestamp) {
    return fromTimestamp(timestamp).toString();
}

/**
 * converts a unix timestamp to a js Date object
 * @param {int} timestamp 
 * @returns {Date}
 */
/*Date*/ function fromUnixTimestamp(timestamp) {
    return new Date(timestamp*1000);
}

/**
 * converts a timestamp to a js Date object
 * @param {int} timestamp 
 * @returns {Date}
 */
/*Date*/ function fromTimestamp(timestamp) {
    return new Date(timestamp);
}

/**
 * converts a Date object to unix timestamp
 * @param {Date} d 
 * @returns {int} unix timestamp
 */
/*int*/ function toUnixTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime()/1000);
}

/**
 * converts a Date object to timestamp
 * @param {Date} d 
 * @returns {int} unix timestamp
 */
/*int*/ function toTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime());
}

/**
 * gets the timestamp representation of current date & time
 * @returns {int} unix timestamp
 */
/*int*/ function getUnixTimestamp() {
    return toUnixTimestamp(new Date());
}

/**
 * gets the timestamp representation of current date & time
 * @returns {int} unix timestamp
 */
/*int*/ function getTimestamp() {
    return toTimestamp(new Date());
}

/**
 * adds the given number of years to the given timestamp, and returns it as unix timestamp
 * @param {int} years 
 * @param {int} timestamp unix timestamp
 * @returns {int} unix timestamp
 */
/*int*/ function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

/**
 * adds the given number of days to the given timestamp, and returns it as unix timestamp
 * @param {int} days 
 * @param {int} timestamp unix timestamp
 * @returns {int} unix timestamp
 */
/*int*/ function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

/**
 * adds the given number of hours to the given timestamp, and returns it as unix timestamp
 * @param {int} hours 
 * @param {int} timestamp unix timestamp
 * @returns {int} unix timestamp
 */
/*int*/ function addHoursTimestamp(hours, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

/**
 * adds the given number of minutes to the given timestamp, and returns it as unix timestamp
 * @param {int} minutes 
 * @param {int} timestamp unix timestamp
 * @returns {int} unix timestamp
 */
function /*int*/ addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getTimestamp();

    timestamp += (minutes * 60 * 1000);
    return timestamp;
}

/**
 * adds the given number of years to the given Date, and returns it as a Date
 * @param {int} years 
 * @param {Date} date 
 * @returns {Date}
 */
function /*Date*/ addYearsDate(years, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addYearsTimestamp(years, toTimestamp(date)));
}

/**
 * adds the given number of days to the given Date, and returns it as a Date
 * @param {int} days 
 * @param {Date} date 
 * @returns {Date}
 */
/*Date*/ function addDaysDate(days, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addDaysTimestamp(days, toTimestamp(date)));
}

/**
 * adds the given number of hours to the given Date, and returns it as a Date
 * @param {int} hours 
 * @param {Date} date 
 * @returns {Date}
 */
/*Date*/ function addHoursDate(hours, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addHoursTimestamp(hours, toTimestamp(date)));
}

/**
 * adds the given number of minutes to the given Date, and returns it as a Date
 * @param {int} minutes 
 * @param {Date} date 
 * @returns {Date}
 */
/*Date*/ function addMinutesDate(minutes, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addMinutesTimestamp(minutes, toTimestamp(date)));
}

/**
 * returns the number of seconds difference between the first and second given dates
 *  (NOTE: it's (date2 - date1))
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {int} number of seconds difference
 */
/*int*/ function dateDiffSeconds(date1, date2) {
    return timestampDiffSeconds(toTimestamp(date1), date2 ? toTimestamp(date2) : null);
}

/**
 * returns the number of seconds difference between the first and second given timestamps 
 *  (NOTE: it's (timestamp2 - timestamp1))
 * @param {int} timestamp1 unix timestamp
 * @param {int} timestamp2 unix timestamp
 * @returns {int} number of seconds difference
 */
/*int*/ function timestampDiffSeconds(timestamp1, timestamp2) {
    if (!timestamp2)
        timestamp2 = getTimestamp();
    return ((timestamp2/1000) - (timestamp1/1000));
}

/**
 * returns the number of minutes difference between the first and second given timestamps 
 *  (NOTE: it's (timestamp2 - timestamp1))
 * @param {int} timestamp1 unix timestamp
 * @param {int} timestamp2 unix timestamp
 * @returns {int} number of minutes difference
 */
/*int*/ function timestampDiffMinutes(timestamp1, timestamp2) {
    return Math.ceil(timestampDiffSeconds(timestamp1, timestamp2)/60); 
}

/**
 * gets the number of seconds that have passed since given date timestamp
 * @param {int} timestamp unix timestamp
 * @returns {int} number (of seconds) 
 */
/*int*/ function secondsSinceTimestamp(timestamp) {
    let output = 0;
    const now = getTimestamp();

    if (timestamp) {
        output = ((now/1000) - (timestamp/1000));

        if (output < 0)
            output = 0;
    }

    return output;
}

/**
 * gets the number of minutes that have passed since given timestamp
 * @param {int} timestamp unix timestamp
 * @returns {int} number (of minutes) 
 */
/*int*/ function minutesSinceTimestamp(timestamp) {
    return Math.floor(secondsSinceTimestamp(timestamp)/60); 
}

/**
 * gets the number of seconds that have passed since given date 
 * @param {Date} date 
 * @returns {int} number (of seconds) 
 */
/*int*/ function secondsSinceDate(date) {
    return secondsSinceTimestamp(toTimestamp(date)); 
}

/**
 * gets the number of minutes that have passed since given date
 * @param {Date} date 
 * @returns {int} number (of minutes) 
 */
/*int*/ function minutesSinceDate(date) {
    return minutesSinceTimestamp(toTimestamp(date)); 
}

/**
 * returns the number of milliseconds in the given number of seconds
 * @param {int} sec 
 * @returns {int} number (of milliseconds) 
 */
/*int*/ function seconds(sec) {
    return (sec * 1000); 
}

/**
 * returns the number of milliseconds in the given number of minutes
 * @param {int} min
 * @returns {int} number (of milliseconds) 
 */
/*int*/ function minutes(min) {
    return (min * 1000 * 60); 
}

/**
 * returns the number of milliseconds in the given number of hours
 * @param {int} count 
 */
/*int*/ function hours(count) {
    return (count * 1000 * 60 * 60); 
}


module.exports = {
    toDateString,
    fromUnixTimestamp,
    fromTimestamp,
    toUnixTimestamp,
    toTimestamp,
    getUnixTimestamp,
    getTimestamp,
    addYearsTimestamp,
    addDaysTimestamp,
    addHoursTimestamp,
    addMinutesTimestamp,
    addYearsDate,
    addDaysDate,
    addHoursDate,
    addMinutesDate, 
    dateDiffSeconds,
    timestampDiffSeconds,
    timestampDiffMinutes,
    secondsSinceTimestamp,
    minutesSinceTimestamp,
    secondsSinceDate,
    minutesSinceDate,
    seconds, 
    minutes,
    hours
};