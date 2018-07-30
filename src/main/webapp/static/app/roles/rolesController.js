

(function () {
    //'use strict'

    angular
        .module('app')
        .controller('rolesController', rolesController);

    function rolesController($scope, rolesDataService) {
        angular.extend($scope, {
            sendMsg: sendMsg,
            registerSw: registerSw,
            askPermission: askPermission,
            subscribe: subscribe
        });

        function sendMsg() {
            rolesDataService.send()
                .then(function (response) {
                    //alert(response.data);
                });
        }

        function registerSw() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                console.log('Service Worker and Push is supported');

                var swRegistration;

                navigator.serviceWorker.register('sw.js')
                    .then(function(swReg) {
                        console.log('Service Worker is registered', swReg);
                        swRegistration = swReg;
                    })
                    .catch(function(error) {
                        console.error('Service Worker Error', error);
                    });
            } else {
                console.warn('Push messaging is not supported');
                pushButton.textContent = 'Push Not Supported';
            }
        }

        function askPermission() {
            if (Notification.permission === "denied") {
                alert("Notifications blocked. Please enable them in your browser.");
            }

            return new Promise(function(resolve, reject) {
                var permissionResult = Notification.requestPermission(function(result) {
                    resolve(result);
                });
                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                }
            })
                .then(function(permissionResult) {
                    if (permissionResult !== 'granted') {
                        throw new Error('We weren\'t granted permission.');
                    }
                });
        }


        function subscribe() {
            return getSWRegistration()
                .then(function(registration) {
                    var subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            'BFhHkNpDJPHyCzPpnUNufgdPaGEA7bFQ-eB4LVfSTzeDzoS-zN4pROy4y0KFelz8A-1tXmGLJevgv14ORdnYcRg'
                        )
                    };
                    return registration.pushManager.subscribe(subscribeOptions);
                })
                .then(function(pushSubscription) {
                    var subStr = JSON.stringify(pushSubscription);
                    var subJson = JSON.parse(subStr);
                    subJson["sourceUrl"] = window.location.href;
                    console.log('Received PushSubscription: ', subJson);

                    rolesDataService.subscribe(subJson)
                        .then(function (response) {
                            console.log('Subscribed successfully: ', response.data);
                        });

                    return pushSubscription;
                });
        }


        // TODO: Move into a variable rather than register each time.
        function getSWRegistration() {
            return navigator.serviceWorker.register('sw.js');
        }


        // function getNotificationPermissionState() {
        //     if (navigator.permissions) {
        //         return navigator.permissions.query({name: 'notifications'})
        //             .then((result) => {
        //             return result.state;
        //             });
        //     }
        //     return new Promise((resolve) => {
        //         resolve(Notification.permission);
        //     });
        // }

        function urlBase64ToUint8Array(base64String) {
            var padding = '='.repeat((4 - base64String.length % 4) % 4);
            var base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            var rawData = window.atob(base64);
            var outputArray = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

    }

})();