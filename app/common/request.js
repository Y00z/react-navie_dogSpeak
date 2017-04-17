/**
 * Created by Yooz on 2017/4/17.
 */

'use strict'

var queryString = require('query-string')
var _ = require('lodash')
var conf = require('./conf')
var Mock = require('mockjs')
var request = {}

request.get = function(url,params) {
    if (params) {
        url += '?' + queryString.stringify(params)
    }
    return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => Mock.mock(responseJson))
}

request.post = function(url,body) {
    var options = _.extend(conf.header,{
        body : JSON.stringify(body)
    });
    return fetch(url,options)
        .then(response => response.json())
        .then((responseJson) => Mock.mock(responseJson))
}

module.exports = request;