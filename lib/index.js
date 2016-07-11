'use strict';

const Inert = require('inert');

module.exports = {
    name: 'static',
    data: Inert,
    when: {
        // Define the base path for static files
        'module:options': function(){
            let options = this.options.static;
            if (!this.util.is(options).object()) options = {};
            if (!this.util.is(options.route).string()) options.route = '/static';
            if (!this.util.is(options.path).object())
                options.path = { type: 'join', args:['${root}', '..',  'static'] };
            options.handler = this.util
                .object({
                    path            : '.',
                    redirectToSlash : true,
                    index           : true
                })
                .merge(options.handler || {})
            this.options.static = options;
            this.options.path   = this.util
                .object(this.options.path || {})
                .merge({ static: options.path });
        },

        // Configure the server once all modules are loaded
        'modules': function(){
            this.options = this.util.object(this.options).merge({
                server: {
                    connections: {
                        routes: {
                            files: {
                                relativeTo: this.path.static
                            }
                        }
                    }
                }
            });
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
