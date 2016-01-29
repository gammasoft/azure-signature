function canonicalizeQuery(query) {
    if(!query) {
        return '';
    }

    return '\n' + Object.keys(query).map(function(parameter) {
        var lowerCaseParameter = parameter.toLowerCase();
        query[lowerCaseParameter] = query[parameter];
        return lowerCaseParameter;
    }).sort().map(function(parameter) {
        var values = query[parameter];

        if(!Array.isArray(values)) {
            values = [values];
        }

        return [
            decodeURIComponent(parameter),
            values.map(function(value) {
                value = value.trim();
                return decodeURIComponent(value);
            }).join(',')
        ].join(':');
    }).join('\n');
}

function Blob(account, container, blob, query) {
    this.canonicalize = function() {
        var path = encodeURI([
            container,
            blob
        ].join('/'));

        return '/' + [
            account,
            path
        ].join('/') + canonicalizeQuery(query);
    }
}

module.exports = Blob;
