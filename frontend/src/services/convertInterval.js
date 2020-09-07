export default function convertInterval(rawInterval) {
    let intervalTypeControl = document.getElementById('interval__type');
    let intervalType = intervalTypeControl.options[intervalTypeControl.selectedIndex].value;
    if (intervalType === "hours") {
        rawInterval = rawInterval * 60;
    } else if (intervalType === "days") {
        rawInterval = rawInterval * 1440;
    }
    return rawInterval;
};