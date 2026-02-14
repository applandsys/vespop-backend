function generateSlug(text) {
    return text
        .toString()                 // Convert to string (safety)
        .toLowerCase()              // Convert to lowercase
        .trim()                     // Remove surrounding whitespace
        .replace(/&/g, '-and-')     // Replace & with 'and'
        .replace(/[\s\W-]+/g, '-')  // Replace spaces and non-word characters with dash
        .replace(/^-+|-+$/g, '');   // Trim leading/trailing dashes
}


module.exports = generateSlug