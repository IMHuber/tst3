

(function () {
    'use strict'

    angular
        .module('app')
        .factory('rolesDataService', rolesDataService);

    function rolesDataService($http) {
        return {
            subscribe: subscribe,
            send: send
        };

        function subscribe(sub) {
            return $http.post("/api/subscribe", sub)
                .catch(console.log("error"));
        }

        function send() {
            return $http.get("/api/send")
                .catch(console.log("error"));
        }
    }

})();