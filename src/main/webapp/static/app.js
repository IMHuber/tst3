
angular
    .module('app', ['ui.router', 'ngMaterial', 'ngAnimate', 'ngAria', 'naif.base64'])
    .config(config)
    .run(run)
    .service('authInterceptor', function($q, $state, $rootScope) {
        var service = this;
        service.responseError = function(response) {
            if (response.status === 401 && $rootScope.isAuthenticated != null && $rootScope.isAuthenticated === true){
                $state.go('login');
            }
            return $q.reject(response);
        };

        // return {
        //     request: function(config) {
        //         console.log('in the interceptor');
        //         //config.headers = config.headers || {};
        //
        //         return config || $q.when(config);
        //     },
        //     response: function(response) {
        //         if (response.status === 401) {
        //             //  Redirect user to login page / signup Page.
        //             //$location.path('/login');
        //         }
        //         return response || $q.when(response);
        //     }
        // };
    });


function config($stateProvider, $mdIconProvider, $httpProvider){
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
        .state('dashboard', {
            title: 'Dashboard',
            url: '/dashboard',
            templateUrl: 'resources/app/dashboard/dashboard.html',
            controller: 'dashboardController'
        })
        .state('campaigns', {
            title: 'Campaigns',
            url: '/campaigns',
            templateUrl: 'resources/app/campaigns/campaigns.html',
            controller: 'campaignsController'
        })
        .state('subscribers', {
            title: 'Subscribers',
            url: '/subscribers',
            templateUrl: 'resources/app/subscribers/subscribers.html',
            controller: 'subscribersController'
        })
        .state('filters', {
            title: 'Filters',
            url: '/filters',
            templateUrl: 'resources/app/filters/filters.html',
            controller: 'filtersController'
        })
        .state('settings', {
            title: 'Settings',
            url: '/settings',
            templateUrl: 'resources/app/settings/settings.html',
            controller: 'settingsController'
        })
        .state('notifications', {
            title: 'Notifications',
            url: '/notifications',
            templateUrl: 'resources/app/notifications2/notifications.html',
            controller: 'notifications2Controller'
        });
    
    $mdIconProvider.defaultIconSet('resources/mdi-icons.svg', 24);
    $httpProvider.interceptors.push('authInterceptor');
}

function run($rootScope, $state, loginDataService) {
    $rootScope.$state = $state;
    $rootScope.logout = logout;
    $rootScope.toggleNavDef = toggleNavDef;

    //$rootScope.apiBaseUrl = '/evif-hotnews';
    $rootScope.apiBaseUrl = '';


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

    $rootScope.navDefItems = [
        {
            title: 'Dashboard',
            state: 'dashboard',
            icon: "fa fa-dashboard",
            active: true
        },
        {
            title: 'Campaigns',
            state: 'campaigns',
            icon: "fa fa-paper-plane",
            active: false
        },
        {
            title: 'Subscribers',
            state: 'subscribers',
            icon: "fa fa-user",
            active: false
        },
        {
            title: 'Filters',
            state: 'filters',
            icon: "fa fa-filter",
            active: false
        },
        {
            title: 'Settings',
            state: 'settings',
            icon: "fa fa-cog",
            active: false
        }
    ];
    
    function logout() {
        loginDataService.logout()
            .then(function (value) {
                $state.go('login');
            });
    }

    function toggleNavDef(navItem) {
        angular.forEach($rootScope.navDefItems, function(item, index) {
            if(navItem.title === item.title)
                navItem.active = true;
            else
                item.active = false;
        });
    }
}
