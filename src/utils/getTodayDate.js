// const date = new Date();
// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();
// const currentDate = `${day}-${month}-${year}`;

function getTodayDate(){
    return new Date().toJSON().slice(0, 10);
}


module.exports = getTodayDate;