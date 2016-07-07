'use strict';

const Package = require('../package.json');

module.exports = {
    name: 'static',
    data: { register: function(server, options, next){ next() }},
    when: { 'plugin:static': function(){
    }}
}

module.exports.data.register.attributes = { pkg: Package };
