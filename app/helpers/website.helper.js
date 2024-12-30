function stringToObject(string) {
    obj = [];
    if (string.trim() != "") {
        obj = [string];
    }

    if (string.includes(",")) {
        obj = string.split(",");
    }
    obj = [...new Set(obj)]
    return obj;
}

let websiteHelper = {
    stringToObject
}

module.exports = { websiteHelper }