var qs = require('querystring');

function canonicalizeQuery(query) {
    if(!query || !Object.keys(query).length) {
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
                value = value.toString().trim();
                return decodeURIComponent(value);
            }).join(',')
        ].join(':');
    }).join('\n');
}

function Blob(account, container, blob, query) {
    query = query || {};

    this.canonicalize = function() {
        var path = encodeURI([
            container,
            blob
        ].join('/'));

        return '/' + [
            account,
            path
        ].join('/') + canonicalizeQuery(query);
    };

    this.queryString = function(signature) {
        if(signature) {
            query.sig = encodeURI(signature);
        }

        var queryString = qs.stringify(query);

        if(queryString) {
            queryString = '?' + queryString;
        }

        return queryString;
    };

    this.name = function() {
        return blob;
    };

    this.toJSON = function() {
        return 'https://' + account + '.blob.core.windows.net/' + [
            container,
            blob
        ].join('/');
    }
}

module.exports = Blob;
