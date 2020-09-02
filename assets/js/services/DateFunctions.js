
function addYears(x) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    const newDate = new Date(year + x, month, day).toISOString().slice(0,10);
    return newDate;
}

function todayFormatYMD(){
    const d = new Date();
    return d.toISOString().slice(0,10);
}

function dateFormatYMD(date, convert = 0){
    let d = new Date(date);
    if (convert == 1){
        d = convertUTCDateToLocalDate(d);
    }
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0"+month;

    let newDate = year+"-"+month+"-"+day;
    return newDate;
}

function newDateDWH(date, time){
    const d = new Date(date);
    let timeArr = time.split(":");

}

function getMonthFr(month){
    let monthFr = "";
    switch (month) {
        case 0:
            return monthFr = "Janvier";
            break;
        case 1:
            return monthFr = "Février";
            break;
        case 2:
            return monthFr = "Mars";
            break;
        case 3:
            return monthFr = "Avril";
            break;
        case 4:
            return monthFr = "Mai";
            break;
        case 5:
            return monthFr = "Juin";
            break;
        case 6:
            return monthFr = "Juillet";
            break;
        case 7:
            return monthFr = "Août";
            break;
        case 8:
            return monthFr = "Septembre";
            break;
        case 9:
            return monthFr = "Octobre";
            break;
        case 10:
            return monthFr = "Novembre";
            break;
        case 11:
            return monthFr = "Décembre";
            break;
    }
}

function dateFormatFr (date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    let monthFr = getMonthFr(month);

    return day + " " + monthFr + " " + year
}

function dateFormatFrDM (date, convert = 0){
    let d = new Date(date);
    if (convert == 1){
        d = convertUTCDateToLocalDate(d);
    }
    const month = d.getMonth();
    const day = d.getDate();
    let monthFr = getMonthFr(month);

    return day + " " + monthFr
}

function orderByDateEnd(a, b) {
    a = a.endDate;
    b = b.endDate;
    let comparison = 0;
    if (a > b) {
        comparison = 1;
    } else if (a < b) {
        comparison = -1;
    }
    return comparison;
}

function orderByDate(a, b) {

    a = a.date;
    b = b.date;
    let comparison = 0;
    if (a > b) {
        comparison = 1;
    } else if (a < b) {
        comparison = -1;
    }
    return comparison;
}

function dateFormatFrDMHM (date, convert = 0){
    let d = new Date(date);
    if (convert == 1){
        d = convertUTCDateToLocalDate(d);
    }
    const month = d.getMonth();
    const day = d.getDate();
    let monthFr = getMonthFr(month);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (hours < 10){
        hours = "0"+hours;
    }
    if (minutes < 10){
        minutes = "0"+minutes;
    }
    return day + " " + monthFr + " "+ hours + "h" + minutes;
}

function dateFormatYMDHMArr (date){
    let d = new Date(date);
    const year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (month < 10){
        month = "0"+month;
    }
    if (day < 10){
        day = "0"+ day;
    }
    if (hours < 10){
        hours = "0"+hours;
    }
    if (minutes < 10){
        minutes = "0"+minutes;
    }
    return [ year+"-"+month + "-"+day, hours +  ":" + minutes];
}

function getHoursHM(date, convert = 0) {
    let d = new Date(date);
    let hours = d.getHours();
    if (convert == 1){
        hours = hours - 2;
    } else if (convert == 2){
        hours = hours - 1;
    }
    let minutes = d.getMinutes();
    if (hours < 10){
        hours = "0"+hours;
    }
    if (minutes < 10){
        minutes = "0"+minutes;
    }
    return hours+":"+minutes;
}

function getHoursHMV2(date, convert = 0) {
    let d = new Date(date);
    let hours = d.getHours();
    if (convert == 1){
        hours = hours - 2;
    } else if (convert == 2){
        hours = hours-1;
    }
    let minutes = d.getMinutes();
    if (hours < 10){
        hours = "0"+hours;
    }
    if (minutes < 10){
        minutes = "0"+minutes;
    }
    return hours+"h"+minutes;
}

function getHoursFRHM(date, convert = 0) {
    let d = new Date(date);
    let hours = d.getHours();
    if (convert == 1){
        hours = hours - 2;
    }
    let minutes = d.getMinutes();
    if (hours < 10){
        hours = "0"+hours;
    }
    if (minutes == 0){
        minutes = ""
    } else if (minutes < 10){
        minutes = "0"+minutes;
    }
    return hours+"h"+minutes;
}

function hourWh(date){
    const arr = date.split(":");
    return arr[0] + "h"+ arr[1];
}

function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
}


export default {
    addYears, todayFormatYMD, dateFormatFr, dateFormatYMD, getHoursHM, dateFormatFrDM, dateFormatFrDMHM, dateFormatYMDHMArr, convertUTCDateToLocalDate, orderByDate, getHoursFRHM, hourWh, getHoursHMV2, orderByDateEnd
}