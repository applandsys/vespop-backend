const safeParseJsonArray = (val) => {
    try {
        if (val == null) return [];
        if (Array.isArray(val)) return val;
        if (typeof val !== 'string') return [];
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const safeParseJsonObject = (maybeJson) => {
    if (maybeJson == null) return undefined;
    if (typeof maybeJson === 'object') return maybeJson;
    try { return JSON.parse(maybeJson); } catch { return undefined; }
};

const toNumberOr = (value, fallback=0) => {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
};

module.exports ={
    safeParseJsonArray,
    safeParseJsonObject,
    toNumberOr
}