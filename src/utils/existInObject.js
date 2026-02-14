function existInObject(obj, targetId) {
    if (!obj || typeof obj !== 'object') return false;

    // Check if current object's [bannerId] matches the targetId
    if (obj.id === targetId) return true;

    // Recursively check left and right children
    return existInObject(obj.left, targetId) || existInObject(obj.right, targetId);
}


module.exports = existInObject;