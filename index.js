(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('angular'));
  } else {
    // Browser globals
    factory(window.angular)
  }
}(function (angular) {
  'use strict';
  angular.module('angular-graphhub', [])
  		 .provider('graphhub', function () {
				var apolloClient = require('apollo-client').ApolloClient;
				var networkInterface = null	

				this.setNetworkInterface = function (uri, apikey) {
					networkInterface = require('apollo-client')
										.createNetworkInterface({
											uri: uri,		
										})
										.use([{
												applyMiddleware(req, next) {
													req.options.headers = {
												      authentication: apikey
													}; 
													next();
												}
										}]);
				};

				this.$get = function () {
					return new apolloClient({ networkInterface: networkInterface });
				};
			});
 });
