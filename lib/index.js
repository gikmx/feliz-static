'use strict';

const Inert   = require('inert');
const Package = require('../package.json');

module.exports = {
    name: 'static',
    data: { register: function(server, options, next){ next(); } },
    when: {
        // Define the base path for static files
        'module:options': function(){
            const opt = this.options;
            if (!this.util.is(opt.static).object()) opt.static = {};
            if (!this.util.is(opt.static.route).string()) opt.static.route = '/static';
            if (!this.util.is(opt.static.path).object())
                opt.static.path = { type: 'join', args:['${root}', '..',  'static'] };
            opt.static.handler = this.util
                .object({
                    path            : '.',
                    redirectToSlash : true,
                    index           : true
                })
                .merge(opt.static.handler)
            if (!this.util.is(opt.path).object()) opt.path = {};
            opt.path = this.util
                .object(opt.path)
                .merge({ static: opt.static.path });
            this.set('options',  opt);
        },
        // Configure the server once all modules are loaded
        'modules': function(){
            this.set('options', this.util.object(this.options).merge({
                server: {
                    connections: {
                        routes: {
                            files: {
                                relativeTo: this.path.static
                            }
                        }
                    }
                }
            }))
        },
        // Manually register Inert as core.
        'plugin:static': function(){
            this.server.register({ register:Inert });
        },
        // Define the static route
        'routes': function(){
            this.server.route({
                method  : 'GET',
                path    : `${this.options.static.route}/{param*}`,
                handler : { directory: this.options.static.handler }
            })
        }
    }
}

module.exports.data.register.attributes = { pkg: Package };
