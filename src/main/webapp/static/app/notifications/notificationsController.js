(function () {
    'use strict';

    angular
        .module('app')
        .controller('notificationsController', notificationsController);

    function notificationsController($scope, $mdDialog, subscriptions, notificationsDataService) {

        angular.extend($scope, {
            hide: $mdDialog.hide,
            cancel: $mdDialog.cancel,
            submit: submit,
            subscriptions: subscriptions
        });

        function submit(notification) {
            try {
                if(notification.actions)
                    notification.actions = JSON.parse(notification.actions);
            } catch (e) {
                console.log(e);
            }
            notificationsDataService.send($scope.subscriptions, notification)
                .then(function (response) {
                    $mdDialog.hide();
                })
                .catch(function (response) {
                    $scope.serverError = response.status + ": " + (response.data ? response.data : response.statusText);
                });
        }
    }
})();
