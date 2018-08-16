<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="app">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Push App</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>



<body onload="registerSw()" style="min-height:100%; height:auto;">


<script type="text/javascript">
    var landingLanguage = "CHANGE ME TO THE LANGUAGE OF A LANDING PAGE";

    function registerSw() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            console.log('Service Worker and Push is supported');

            var swRegistration;

            return getSWRegistration()
                .then(function(swReg) {
                    console.log('Service Worker is registered', swReg);
                    swRegistration = swReg;

                    getNotificationPermissionState()
                        .then(function (result) {
                            if (result !== 'granted') {
                                askPermission();
                            }
                        });
                })
                .catch(function(error) {
                    console.error('Service Worker Error', error);
                });
        } else {
            console.warn('Push messaging is not supported');
            pushButton.textContent = 'Push Not Supported';
        }
    }

    function getNotificationPermissionState() {
        if (navigator.permissions) {
            return navigator.permissions.query({name: 'notifications'})
                .then((result) => {
                return result.state;
        });
        }
        return new Promise((resolve) => {
            resolve(Notification.permission);
    });
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
                subscribe();
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
                subJson["browserInfo"] = getBrowserInfo();
                subJson["landingLanguage"] = landingLanguage;
                subJson["categoryNames"] = ['unknown', 'any'];
                subJson["geoInfo"] = getGeoInfo();
                console.log('Received PushSubscription: ', subJson);

                saveSubscription(subJson)
                    .then(function (response) {
                        console.log('Subscribed finished. Status: ', response);
                    });

                return pushSubscription;
            });
    }

    function saveSubscription(subJson) {
        var xhr = new XMLHttpRequest();
        var url = "/api/subscription/subscribe";
        //var url = "https://env-9888409.jelastic.regruhosting.ru/api/subscribe";
        //var url = "http://pushsend-pushgroup.193b.starter-ca-central-1.openshiftapps.com/pushapp-1.0-SNAPSHOT/api/subscribe";

        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        return new Promise(function(resolve, reject) {
            xhr.send(JSON.stringify(subJson));
            resolve(xhr.status);
        })
    }


    function getSWRegistration() {
        return navigator.serviceWorker.register('/sw.js');
    }

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

    function getBrowserInfo() {
        try {
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var browserName  = navigator.appName;
            var fullVersion  = ''+parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion,10);
            var nameOffset,verOffset,ix;

// In Opera 15+, the true version is after "OPR/"
            if ((verOffset=nAgt.indexOf("OPR/"))!==-1) {
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset+4);
            }
// In older Opera, the true version is after "Opera" or after "Version"
            else if ((verOffset=nAgt.indexOf("Opera"))!==-1) {
                browserName = "Opera";
                fullVersion = nAgt.substring(verOffset+6);
                if ((verOffset=nAgt.indexOf("Version"))!==-1)
                    fullVersion = nAgt.substring(verOffset+8);
            }
// In MSIE, the true version is after "MSIE" in userAgent
            else if ((verOffset=nAgt.indexOf("MSIE"))!==-1) {
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset+5);
            }
// In Chrome, the true version is after "Chrome"
            else if ((verOffset=nAgt.indexOf("Chrome"))!==-1) {
                browserName = "Chrome";
                fullVersion = nAgt.substring(verOffset+7);
            }
// In Safari, the true version is after "Safari" or after "Version"
            else if ((verOffset=nAgt.indexOf("Safari"))!==-1) {
                browserName = "Safari";
                fullVersion = nAgt.substring(verOffset+7);
                if ((verOffset=nAgt.indexOf("Version"))!==-1)
                    fullVersion = nAgt.substring(verOffset+8);
            }
// In Firefox, the true version is after "Firefox"
            else if ((verOffset=nAgt.indexOf("Firefox"))!==-1) {
                browserName = "Firefox";
                fullVersion = nAgt.substring(verOffset+8);
            }
// In most other browsers, "name/version" is at the end of userAgent
            else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                (verOffset=nAgt.lastIndexOf('/')) )
            {
                browserName = nAgt.substring(nameOffset,verOffset);
                fullVersion = nAgt.substring(verOffset+1);
                if (browserName.toLowerCase()===browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }
// trim the fullVersion string at semicolon/space if present
            if ((ix=fullVersion.indexOf(";"))!==-1)
                fullVersion=fullVersion.substring(0,ix);
            if ((ix=fullVersion.indexOf(" "))!==-1)
                fullVersion=fullVersion.substring(0,ix);

            majorVersion = parseInt(''+fullVersion,10);
            if (isNaN(majorVersion)) {
                fullVersion  = ''+parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion,10);
            }


            browserName = replaceApos(browserName.toString());
            fullVersion = replaceApos(fullVersion.toString());
            majorVersion = replaceApos(majorVersion.toString());
            var navAppName = replaceApos(navigator.appName.toString());
            var navUserAgent = replaceApos(navigator.userAgent.toString());

            return {browserName:browserName, fullVersion:fullVersion, majorVersion:majorVersion,
                navAppName:navAppName, navUserAgent:navUserAgent, language: navigator.language || navigator.userLanguage};
        }catch(e){
            console.log(e);
        }
    }
    
    function replaceApos(val) {
        return val.replace(/["']/g, "");
    }

    function getIp() {
        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", 'https://api.ipify.org/', false);
            xmlHttp.send(null);
            return xmlHttp.responseText;
        } catch (e) {
            console.log(e);
        }
    }

    function getGeoInfo() {
        var geoApis = [
            {url: 'https://json.geoiplookup.io/', ip: 'ip', countryCode: 'country_code', countryName: 'country_name', cityName: 'city', regionName: 'region'},
            {url: 'https://ipapi.co/json/', ip: 'ip', countryCode: 'country', countryName: 'country_name', cityName: 'city', regionName: 'region'},
            {url: 'http://www.geoplugin.net/json.gp', ip: 'geoplugin_request', countryCode: 'geoplugin_countryCode', countryName: 'geoplugin_countryName', cityName: 'geoplugin_city', regionName: 'geoplugin_region'},
            {url: 'http://ip-api.com/json', ip: 'query', countryCode: 'countryCode', countryName: 'country', cityName: 'city', regionName: 'regionName'},
            {url: 'http://api.db-ip.com/v2/free/self', ip: 'ipAddress', countryCode: 'countryCode', countryName: 'countryName', cityName: 'city', regionName: 'empty'},
            {url: 'http://gd.geobytes.com/GetCityDetails', ip: 'geobytesremoteip', countryCode: 'geobytesinternet', countryName: 'geobytescountry', cityName: 'geobytescity', regionName: 'geobytesregion'}
        ];

        for (var i = 0; i < geoApis.length; i++) {
            try {
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", geoApis[i].url, false);
                xmlHttp.send(null);
                var response = JSON.parse(xmlHttp.responseText);
                
                if(response[geoApis[i].countryCode] != null) {
                    return {ip: response[geoApis[i].ip], countryCode: response[geoApis[i].countryCode], countryName: response[geoApis[i].countryName],
                        cityName: response[geoApis[i].cityName], regionName: response[geoApis[i].regionName]};
                }
            } catch (e) {
                console.log(e);
            }
            return {ip: getIp()};
        }
    }

</script>


<script src="/libs/angularjs/1.7.2/angular.js"></script>
<script src="/libs/angular-ui-router/1.0.15/angular-ui-router.js"></script>
<script src="/libs/angularjs/1.7.2/angular-resource.js"></script>
<script src="/libs/angular-animate/1.7.2/angular-animate.js"></script>
<script src="/libs/angular-material/1.1.5/angular-material.js"></script>
<script src="/libs/angular-aria/1.6.9/angular-aria.min.js"></script>
<script src="resources/app.js"></script>
<script src="resources/app/login/loginController.js"></script>
<script src="resources/app/login/loginDataService.js"></script>
<script src="resources/app/main/mainController.js"></script>
<script src="resources/app/main/mainDataService.js"></script>
<script src="resources/app/roles/rolesController.js"></script>
<script src="resources/app/roles/rolesDataService.js"></script>
<script src="resources/app/users/usersController.js"></script>
<script src="resources/app/notifications/notificationsController.js"></script>
<script src="resources/app/notifications/notificationsDataService.js"></script>

<link rel="stylesheet" href="libs/bootstrap/4.1.1/css/bootstrap.css">
<link rel="stylesheet" href="libs/angular-material/1.1.5/angular-material.min.css"/>
<link rel="stylesheet" href="resources/css/app.css">


<header style="background-color: black">
    <nav class="navbar navbar-default">
        <div class="container">
            <div class="navbar-header" style="color: #007bff;">
                <a class="navbar-brand">Push The Tempo</a>
            </div>

            <div class="nav navbar-nav navbar-right" style="color: #007bff;" ng-if="isAuthenticated">
                <a class="navbar-brand" ng-click="logout()" style="cursor: pointer">Logout</a>
            </div>
        </div>
    </nav>
</header>

<div ui-view></div>

</body>
</html>
