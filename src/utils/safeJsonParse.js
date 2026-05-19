const safeJsonParse = (value, fallback) => {
    try {
        if (!value || value === "") return fallback;
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

module.exports = {
    safeJsonParse
}