
angular
    .module('app', ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria'])
    .config(config)
    .run(run);


function config($stateProvider, $mdIconProvider){
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
        });
    
    $mdIconProvider.defaultIconSet('resources/mdi-icons.svg', 24);
}

function run($rootScope, $state, loginDataService) {
    $rootScope.$state = $state;
    $rootScope.logout = logout;

    $rootScope.apiBaseUrl = '/pushapp-bestnews';
    //$rootScope.apiBaseUrl = '';

    //$locationProvider.html5Mode(true);
    //var baseUrl = window.location.origin;

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
