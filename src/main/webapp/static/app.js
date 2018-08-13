
angular
    .module('app', ['ui.router'])
    .config(config)
    .run(run);


function config($stateProvider){
    $stateProvider
        .state('login', {
            title: 'login',
            url: '/login',
            templateUrl: 'resources/app/login/login.html',
            controller: 'loginController'
        })
        .state('main', {
            title: 'mainState',
            url: '/main',
            templateUrl: 'resources/app/main/main.html',
            controller: 'mainController'
        })
        .state('users', {
            title: 'usersState',
            url: '/users',
            templateUrl: 'resources/app/users/users.html',
            controller: 'usersController'
        })
        .state('roles', {
            title: 'rolesState',
            url: '/roles',
            templateUrl: 'resources/app/roles/roles.html',
            controller: 'rolesController'
        })
}

function run($rootScope, $state, loginDataService) {
    $rootScope.$state = $state;
    $rootScope.logout = logout;

    loginDataService.getCurrentUser()
        .then(function (response) {
            if(response.status === 200) {
                $rootScope.isAuthenticated = !loginDataService.isAnonymous(response.data);
            } else {
                $rootScope.isAuthenticated = false;
                $state.go('login');
                //$state.go('main');
            }
        });
    
    function logout() {
        loginDataService.logout()
            .then(function (value) {
                $state.go('login');
            });
    }
}
