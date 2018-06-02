

Date.prototype.toUnixTimestamp = () => {
    return Math.floor(this.getTime()/1000);
}

Date.prototype.toTimestamp = () => {
    return Math.floor(this.getTime());
}

function fromUnixTimestamp(timestamp){
    return new Date(timestamp*1000); 
}

function fromTimestamp(timestamp){
    return new Date(timestamp); 
}

function toUnixTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime()/1000);
}

function toTimestamp(d) {
    if (!d.getTime)
        d = new Date(d);
    return Math.floor(d.getTime());
}

function getUnixTimestamp(){
    return toUnixTimestamp(new Date()); 
}

function getTimestamp(){
    return toTimestamp(new Date()); 
}

function addYearsTimestamp(years, timestamp) {
    return addHoursTimestamp(365 * years, timestamp);
}

function addDaysTimestamp(days, timestamp) {
    return addHoursTimestamp(60 * days, timestamp);
}

function addHoursTimestamp(hours, timestamp) {
    return addMinutesTimestamp(60 * hours, timestamp);
}

function addMinutesTimestamp(minutes, timestamp) {
    if (!timestamp)
        timestamp = getUnixTimestamp(); 

    timestamp += (minutes * 60);
    return timestamp;
}


$(document).ready(function () {
    window.dateUtil = {
        fromUnixTimestamp,
        toUnixTimestamp,
        getUnixTimestamp,
        fromTimestamp,
        toTimestamp,
        getTimestamp,
        addYearsTimestamp,
        addDaysTimestamp,
        addHoursTimestamp,
        addMinutesTimestamp
    };
});