var moment = require('moment');

// console.log(momemt);

function formatDate(date) {

    let momentDate = moment(date);//, 'DD/MM/YYYY', true);

    return momentDate.format('DD/MM/YYYY');
}

function parseDate(date) {

    if (!date) {
        throw Error('Invalid argument');
    }

    let momentDate = moment(date, 'DD/MM/YYYY', true);

    if (!momentDate.isValid()) {
        throw Error('Invalid date string');
    }
    // console.log(momentDate.toDate().getTimezoneOffset())
    return momentDate.toDate();

}

function parseCSVDate(date) {

    if (!date) {
        throw Error('Invalid argument');
    }

    let momentDate = moment(date, 'DD-MMM-YYYY', true);

    if (!momentDate.isValid()) {
        throw Error('Invalid date string');
    }
    // console.log(momentDate.toDate().getTimezoneOffset())
    return momentDate.toDate();

}


module.exports.formatDate = formatDate;
module.exports.parseDate = parseDate;
module.exports.parseCSVDate = parseCSVDate;