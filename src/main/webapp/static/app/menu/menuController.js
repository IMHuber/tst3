(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    function menuController($scope) {
        angular.extend($scope, {
            menuItems: [
                {
                    state: 'main',
                    title: 'Subscriptions',
                    img: 'img/Server.svg'
                },
                {
                    state: 'notification',
                    title: 'Notifications',
                    img: 'img/Umbrella.svg'
                }
            ]
        });
    }
})();
