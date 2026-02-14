function getCurrentMonth(today=null){
    return  today ? new Date(today).toISOString().slice(0, 7) : new Date().toISOString().slice(0, 7) ;
}

module.exports = getCurrentMonth;