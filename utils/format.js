var momemt = require('moment');

// console.log(momemt);

function formatDate(date){

    let momentDate =  momemt(date);//, 'DD / MM / YYYY', true);

    return momentDate.format('DD / MM / YYYY');
}

function parseDate(date){

    if(!date)
    {
        throw Error('Invalid argument');
    }

    let momentDate = momemt(date, 'DD / MM / YYYY', true);

    if(!momentDate.isValid()){
        throw Error('Invalid date string');
    }
// console.log(momentDate.toDate().getTimezoneOffset())
    return momentDate.toDate();

}


module.exports.formatDate = formatDate;
module.exports.parseDate = parseDate;