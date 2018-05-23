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

// ----------------------------------------------------------------------------------------------- 
// converts timestamp to string 
// 
// args
//  timestamp: a unix timestamp 
// 
// returns: string 
/*string*/ function toDateString(timestamp) {
    return fromTimestamp(timestamp).toString();
}

// ----------------------------------------------------------------------------------------------- 
// converts a unix timestamp to a js Date object
// 
// args
//  timestamp: unix timestamp
//
// returns: Date
/*Date*/ function fromUnixTimestamp(timestamp) {
    return new Date(timestamp*1000);
}

// ----------------------------------------------------------------------------------------------- 
// converts a timestamp to a js Date object
// 
// args
//  timestamp: timestamp
//
// returns: Date
/*Date*/ function fromTimestamp(timestamp) {
    return new Date(timestamp);
}

// ----------------------------------------------------------------------------------------------- 
// converts a Date object t0 unix timestamp
//
// args
//  d: a Date object
//
// returns: unix timestamp 
/*int*/ function toUnixTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime()/1000);
}

// ----------------------------------------------------------------------------------------------- 
// converts a Date object to timestamp
//
// args
//  d: a Date object
//
// returns: timestamp 
/*int*/ function toTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime());
}

// ----------------------------------------------------------------------------------------------- 
// gets the unix timestamp for current date & time
// 
// returns: unix timestamp 
/*int*/ function getUnixTimestamp() {
    return toUnixTimestamp(new Date());
}

// ----------------------------------------------------------------------------------------------- 
// gets the timestamp for current date & time
// 
// returns: timestamp 
/*int*/ function getTimestamp() {
    return toTimestamp(new Date());
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of years to the given timestamp, and returns it as unix timestamp
// 
// args
//  years: the number of years to add
//  timestamp: unix timestamp
//
// returns: unix timestamp
/*int*/ function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of days to the given timestamp, and returns it as unix timestamp
// 
// args
//  days: the number of days to add
//  timestamp: unix timestamp
//
// returns: unix timestamp
/*int*/ function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of hours to the given timestamp, and returns it as unix timestamp
// 
// args
//  hours: the number of hours to add
//  timestamp: unix timestamp
//
// returns: unix timestamp
/*int*/ function addHoursTimestamp(hours, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of minutes to the given timestamp, and returns it as unix timestamp
// 
// args
//  minutes: the number of minutes to add
//  timestamp: unix timestamp
//
// returns: unix timestamp
/*int*/ function addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getTimestamp();

    timestamp += (minutes * 60 * 1000);
    return timestamp;
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of years to the given Date, and returns it as a Date
// 
// args
//  years: the number of years to add
//  date: javascript Date object
//
// returns: Date
/*Date*/ function addYearsDate(years, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addYearsTimestamp(years, toTimestamp(date)));
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of days to the given Date, and returns it as a Date
// 
// args
//  days: the number of days to add
//  date: javascript Date object
//
// returns: Date
/*Date*/ function addDaysDate(days, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addDaysTimestamp(days, toTimestamp(date)));
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of hours to the given Date, and returns it as a Date
// 
// args
//  hours: the number of hours to add
//  date: javascript Date object
//
// returns: Date
/*Date*/ function addHoursDate(hours, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addHoursTimestamp(hours, toTimestamp(date)));
}

// ----------------------------------------------------------------------------------------------- 
// adds the given number of minutes to the given Date, and returns it as a Date
// 
// args
//  minutes: the number of minutes to add
//  date: javascript Date object
//
// returns: Date
/*Date*/ function addMinutesDate(minutes, date) {
    if (!date)
        date = new Date();

    return fromTimestamp(addMinutesTimestamp(minutes, toTimestamp(date)));
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of seconds difference between the first and second given dates 
//  (NOTE: it's (date2 - date1))
// 
// args
//  date1: javascript Date
//  date2: another javascript Date
//
// returns: number (seconds)
/*int*/ function dateDiffSeconds(date1, date2) {
    return timestampDiffSeconds(toTimestamp(date1), date2 ? toTimestamp(date2) : null);
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of seconds difference between the first and second given timestamps 
//  (NOTE: it's (timestamp2 - timestamp1))
// 
// args
//  timestamp1: unix timestamp
//  timestamp2: another unix timestamp
//
// returns: number (seconds)
/*int*/ function timestampDiffSeconds(timestamp1, timestamp2) {
    if (!timestamp2)
        timestamp2 = getTimestamp();
    return ((timestamp2/1000) - (timestamp1/1000));
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of minutes difference between the first and second given timestamps 
//  (NOTE: it's (timestamp2 - timestamp1))
// 
// args
//  timestamp1: unix timestamp
//  timestamp2: another unix timestamp
//
// returns: number (minutes)
/*int*/ function timestampDiffMinutes(timestamp1, timestamp2) {
    return Math.ceil(timestampDiffSeconds(timestamp1, timestamp2)/60); 
}

// ----------------------------------------------------------------------------------------------- 
// gets the number of seconds that have passed since given date timestamp
//
// returns: number (of seconds) 
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

// ----------------------------------------------------------------------------------------------- 
// gets the number of minutes that have passed since given date timestamp
//
// returns: number (of minutes) 
/*int*/ function minutesSinceTimestamp(timestamp) {
    return Math.floor(secondsSinceTimestamp(timestamp)/60); 
}

// ----------------------------------------------------------------------------------------------- 
// gets the number of seconds that have passed since given date 
//
// returns: number (of seconds) 
/*int*/ function secondsSinceDate(date) {
    return secondsSinceTimestamp(toTimestamp(date)); 
}

// ----------------------------------------------------------------------------------------------- 
// gets the number of minutes that have passed since given date 
//
// returns: number (of minutes) 
/*int*/ function minutesSinceDate(date) {
    return minutesSinceTimestamp(toTimestamp(date)); 
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of milliseconds in the given number of seconds
// 
/*int*/ function seconds(count) {
    return (count * 1000); 
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of milliseconds in the given number of minutes
// 
/*int*/ function minutes(count) {
    return (count * 1000 * 60); 
}

// ----------------------------------------------------------------------------------------------- 
// returns the number of milliseconds in the given number of hours
// 
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