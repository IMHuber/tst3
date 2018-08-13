(function () {

    angular
        .module('app')
        .controller('loginController', loginController);

    function loginController($scope, loginDataService, $state, $rootScope) {
        angular.extend($scope, {
            login: login
        });

        function login(username, password) {
            loginDataService.login(username, password)
                .then(function (response) {
                    $rootScope.isAuthenticated = true;
                    $state.go('main');
                }, function (reason) {
                    $scope.authError = reason;
                });
        }
        
    }
})();