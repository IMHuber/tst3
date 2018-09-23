(function () {
    'use strict';

    angular
        .module('app')
        .controller('campaignsController', campaignsController);

    function campaignsController($scope) {
        angular.extend($scope, {
            toggleNavHeadBar : toggleNavHeadBar,

            navHeadItems: [
                {
                    state: 'campaigns',
                    title: 'Campaigns',
                    active: true
                },
                {
                    state: 'onboardingSett',
                    title: 'Overall Stats',
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
