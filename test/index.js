'use strict';

const Test = require('feliz.test');
const Static = require('../lib');

Test([
    { desc:'The feliz-server-static plugin', test: function(tape){
        tape.skip('should have tests defined.');
        tape.end();
    }}
]).subscribe();
