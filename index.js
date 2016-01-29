'use strict';

var crypto = require('crypto');

function canonicalizeHeaders(headers) {
    if(!headers) {
        return '';
    }

    return Object.keys(headers).map(function(header) {
        var lowerCaseHeader = header.toLowerCase();
        headers[lowerCaseHeader] = headers[header];
        return lowerCaseHeader;
    }).sort().map(function(header) {
        var value = headers[header];
        value = value.replace(/\s\s+/g, ' ').trim();
        return [header, value].join(':');
    }).join('\n') + '\n';
}

function getSignature(params) {
    var signature = [
            params.verb.toUpperCase(),
            params.contentEncoding || '',
            params.contentLanguage || '',
            params.contentLength || '',
            params.contentMD || '',
            params.contentType || '',
            params.date || '',
            params.ifModifiedSince || '',
            params.ifMatch || '',
            params.ifNoneMatch || '',
            params.ifUnmodifiedSince || '',
            params.Range || '',
            canonicalizeHeaders(params.customHeaders) +
            params.resource.canonicalize()
        ].join('\n'),
        key = new Buffer(params.key, 'base64');

    return crypto.createHmac('sha256', key)
                    .update(signature, 'utf-8')
                    .digest('base64');
}

module.exports = getSignature;
