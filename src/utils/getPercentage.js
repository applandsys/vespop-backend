function calculatePercentage(part, whole) {
    if (whole === 0) {
        return 0;
    }
    return (part / whole) * 100;
}

module.exports = calculatePercentage;
