//数据库stamp时间转换
export function transformTimestamp(timestamp) {
    let a = new Date(timestamp).getTime();
    const date = new Date(a);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
    const h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    const m = (date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes()) ;
    const dateString = Y + M + D + h + m;
    return dateString;
}
// 时间戳转年月日时分秒
export function timestampToTime(num) {
    const date = new Date(num);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    let strDate = Y+M+D+h+m+s;
    return strDate;
}

export function secondToDate(num) {
    // 北京与标准时间差8小时
    return new Date((num - 8 * 3600) * 1000).getTime()
}

export function dateToSecond(date) {
    const time = new Date(date);
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    return h * 3600 + m * 60 + s;
}


