
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

function dateFormatYMD(date){
    const d = new Date(date);
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let day = d.getDate();
    if (day < 10) day = "0" + day;
    if (month < 10) month = "0"+month;

    let newDate = year+"-"+month+"-"+day;
    return newDate;
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

function getHoursHM(date) {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (hours < 10){
        hours = hours+"0";
    }
    if (minutes < 10){
        minutes = minutes+"0";
    }
    return hours+":"+minutes;
}


export default {
    addYears, todayFormatYMD, dateFormatFr, dateFormatYMD, getHoursHM
}