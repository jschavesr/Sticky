

checkFormat = (stringDate) => {

    let re = new RegExp('^[1-9][0-9]{3}-[0-9]{2}-[0-9]{2}$');

    if (!stringDate.match(re)) {
        return false;
    }
    let year = parseInt(stringDate.split('-')[0]);
    let month = parseInt(stringDate.split('-')[1]);
    let day = parseInt(stringDate.split('-')[2]);

    let days =  [31,28,31,30,31,30, 31,31, 30, 31,30,31];
    // check leap year
    if ( ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
        days[1] += 1;
    if (month > 12 || month < 1) return false;
    if (day < 0 || day > days[month-1]) return false;
    
    return true;
};




parseDate = (stringDate) => {

    
    let year = parseInt(stringDate.split('-')[0]);
    let month = parseInt(stringDate.split('-')[1]);
    let day = parseInt(stringDate.split('-')[2])

    let date  = new Date(year, month-1, day);

    return date;

};


const dateHelper = {
    checkFormat,
    parseDate
};

module.exports = dateHelper;