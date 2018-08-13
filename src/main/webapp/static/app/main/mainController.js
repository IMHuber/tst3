

(function () {

    angular
        .module('app')
        .controller('mainController', mainController);

    function mainController($scope, mainDataService, $filter) {
        angular.extend($scope, {
            getSubscriptions : getSubscriptions,
            send : send,
            compareStr : compareStr,
            addSelectedValueToArray : addSelectedValueToArray
        });

        $scope.headingTitle = "Select filters for subscriptions";
        getFilters();
        

        function getFilters() {
            mainDataService.getFilters()
                .then(function (response) {
                    $scope.filters = response.data;
                });
        }

        function getSubscriptions() {
            mainDataService.getSubscriptions($scope.filters)
                .then(function (response) {
                    $scope.subscriptionRes = response.data;
                });
        }

        function send() {
            mainDataService.send($scope.filters)
                .then(function (response) {
                    console.log(response);
                });
        }

        function compareStr(s1, s2) {
            var res = angular.equals(s1, s2);
            return res;
        }

        function addSelectedValueToArray(condition) {
            condition.selectedValues = [];
            condition.selectedValues.push(condition.selectedValue);
        }


    }

})();