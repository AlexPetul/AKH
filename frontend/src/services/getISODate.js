export default function getISODate(rawData) {
    let dateStartArr = rawData.split('-');
    let dateTimeStartArr = dateStartArr[2].split(' ');
    let timeStartArr = dateTimeStartArr[1].split(':');

    let year = dateTimeStartArr[0];
    let month = dateStartArr[1];
    let day = dateStartArr[0];
    let hours = timeStartArr[0];
    let min = timeStartArr[1];
    let seconds = timeStartArr[2];
    return `${year}-${month}-${day}T${hours}:${min}:${seconds}.000`;
};