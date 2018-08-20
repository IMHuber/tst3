

(function () {
    'use strict'

    angular
        .module('app')
        .factory('notificationsDataService', notificationsDataService);

    function notificationsDataService($http, $rootScope) {
        return {
            send: send
        };


        function send(subscriptions, notification) {
            return $http({
                url: $rootScope.apiBaseUrl + "/api/subscription/send",
                method: "POST",
                data: {subscriptions: subscriptions, payload: notification}
            });
        }
    }

})();