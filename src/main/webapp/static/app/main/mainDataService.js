

(function () {
    'use strict'

    angular
        .module('app')
        .factory('mainDataService', mainDataService);

    function mainDataService($http) {
        return {
            getFilters: getFilters,
            getSubscriptions: getSubscriptions,
            send: send
        };
        

        function getFilters() {
            return $http.get("/api/subscription/filters")
                .catch(console.log("error"));
        }

        function getSubscriptions(filters) {
            return $http({
                url: "/api/subscription",
                method: "POST",
                data: filters
            })
                .catch(function (reason) {
                    console.log(reason);
                });
        }

        function send(filters) {
            //var data = {conditions: filters};
            return $http({
                url: "/api/subscription/send",
                method: "POST",
                // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                // transformRequest: function(obj) {
                //     var str = [];
                //     for(var p in obj)
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //     return str.join("&");
                // },
                data: {conditions: filters}
            })
                .catch(function (reason) {
                    console.log(reason);
                });
        }
    }

})();