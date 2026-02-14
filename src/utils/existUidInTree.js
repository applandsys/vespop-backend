function existUidInObject(obj, targetId) {
    if (!obj || typeof obj !== 'object') return false;

    // Check if current object's [bannerId] matches the targetId
    if (obj.uid === targetId) return true;

    // Recursively check left and right children
    return existUidInObject(obj.left, targetId) || existUidInObject(obj.right, targetId);
}


module.exports = existUidInObject;