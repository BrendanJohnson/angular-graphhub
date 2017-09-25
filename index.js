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
  var graphhubUri = null;
	
  angular.module('angular-graphhub', [])
  		 .provider('$graphhub', function () {
				var apolloClient = require('apollo-client').ApolloClient;
				var networkInterface = null	

				this.setNetworkInterface = function(uri, apikey) {
					graphhubUri = uri;
					networkInterface = require('apollo-client')
								.createNetworkInterface({
									uri: graphhubUri + 'quivers-graphhub',		
								})
								.use([{
									applyMiddleware: function applyMiddleware(req, next) {
											      req.options.headers = {
											        'Authorization': localStorage.getItem('graphhub-token') ? 'bearer ' + localStorage.getItem('graphhub-token') : null,
											        'Content-Type': 'application/json'
											      };
											      next();
											  }
						  		}]);
				};

				this.$get = function() {
					return new apolloClient({ networkInterface: networkInterface });
				};
			})
	  	.decorator('$graphhub', ['$delegate', '$http', function ($delegate, $http) {
  		 	$delegate.login = function (email, password) {
  		 		$http.post(graphhubUri + 'apiauth/signin',
  		 				{ email: email, password: password })
  		 			.then(function (response) {
  		 			 	localStorage.setItem('graphhub-token', response.data.token)
  		 			});
  		 	};
  		 	return $delegate;
  		 }]);
 }));
