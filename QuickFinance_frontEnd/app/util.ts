export let getCountDays = function(date: string) {
    var curDate = new Date(date);
    var curMonth = curDate.getMonth();
    curDate.setMonth(curMonth + 1);
    curDate.setDate(0);
    return curDate.getDate();
}