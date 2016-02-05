'use strict';

var crypto = require('crypto');

function canonicalizeHeaders(headers) {
    if(!headers || !Object.keys(headers).length) {
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

function getSignature(request, key) {
    var decodedKey = new Buffer(key, 'base64'),
        hmac = crypto.createHmac('sha256', decodedKey);

    hmac.update(request, 'utf-8');
    return hmac.digest('base64');
}

function calculate(request, key) {
    var stringToSign = [
        request.verb.toUpperCase(),
        request.contentEncoding || '',
        request.contentLanguage || '',
        request.contentLength || '',
        request.contentMD5 || '',
        request.contentType || '',
        request.date || '',
        request.ifModifiedSince || '',
        request.ifMatch || '',
        request.ifNoneMatch || '',
        request.ifUnmodifiedSince || '',
        request.range || '',
        canonicalizeHeaders(request.customHeaders) +
        request.resource.canonicalize()
    ].join('\n');

    return getSignature(stringToSign, key);
}

module.exports.calculate = calculate;
module.exports.resources = {
    Blob: require('./resources/blob')
};