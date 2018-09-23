(function () {
    'use strict';

    angular
        .module('app')
        .controller('settingsController', settingsController);

    function settingsController($scope) {
        angular.extend($scope, {
            toggleNavHeadBar : toggleNavHeadBar,

            navHeadItems: [
                {
                    state: 'generalSett',
                    title: 'General',
                    active: true
                },
                {
                    state: 'onboardingSett',
                    title: 'Onboarding',
                    active: false
                },
                {
                    state: 'subOptSett',
                    title: 'Sub Optin',
                    active: false
                },
                {
                    state: 'welNotSett',
                    title: 'Welcome Notification',
                    active: false
                },
                {
                    state: 'instSett',
                    title: 'Installation',
                    active: false
                }
            ]
        });
        
        function toggleNavHeadBar(navItem) {
            angular.forEach($scope.navHeadItems, function(item, index) {
                if(navItem.title === item.title)
                    navItem.active = true;
                else
                    item.active = false;
            });
        }
    }
})();
