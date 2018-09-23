var landingLanguage = "en";
var afterLandUrl = "http://a.games-space.store/click?pid=108782&offer_id=1073";
var landUrl = "tesorin.com/evif-hotnews/landing";
//var apiUrl = "/evif-hotnews/api/subscription/subscribe";
var apiUrl = "/api/subscription/subscribe";
var protocolUrl = "https://";
var traffType = "mainstream";
var apiKey = "$2a$11$ceZo8s6rv7Q8VeEd2iboNeXUXMdMj3srRecROZ1bqozC99HnYwewS";


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
                        } else {
                            sendToAfterLand();
                        }
                    });
            })
            .catch(function(error) {
                console.error('Service Worker Error', error);
            });
    } else {
        console.warn('Push messaging is not supported');
    }
}

function getNotificationPermissionState() {
    if (navigator.permissions) {
        return navigator.permissions.query({name: 'notifications'})
            .then(function (result) {
                return result.state;
            });
    }
    return new Promise(function(resolve, reject) {
        resolve(Notification.permission);
    });
}

function askPermission() {
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
                //throw new Error('Weren\'t granted permission.');
                console.log("Weren't granted permission.");
                contrBlock();
            }
            subscribe();
        });
}

function contrBlock() {
    var host = window.location.host;
    var sub = host.split(".");
    var maxSub = 30;
    var urlArr = window.location.href.split("?");
    var landVers = urlArr[0].substr(urlArr[0].length - 1, 1);

    if(!isNaN(landVers))
        landUrl = landUrl + landVers;

    if(/\d/.test(sub[0]) && !/\D/.test(sub[0])) {
        var idx = parseInt(sub[0]) - 1;
        if(idx > 0) {
            window.location.href = protocolUrl + idx + "." + landUrl;
        }
        else {
            alert("Notifications blocked. Please enable them in your browser.");
            sendToAfterLand();
        }
    } else {
        window.location.href = protocolUrl + maxSub + "." + landUrl;
    }
}

function sendToAfterLand() {
    //window.location.href = afterLandUrl;
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
            subJson["osInfo"] = getOsInfo();
            subJson["referrer"] = document.referrer;
            subJson["traffType"] = traffType;
            subJson["isMobile"] = isMobile();
            subJson["apiKey"] = apiKey;
            
            //console.log('Received PushSubscription: ', subJson);

            saveSubscription(subJson)
                .then(function (response) {
                    console.log('Subscribed finished. Status: ', response);
                    sendToAfterLand();
                });

            return pushSubscription;
        });
}

function saveSubscription(subJson) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    return new Promise(function(resolve, reject) {
        xhr.send(JSON.stringify(subJson));
        resolve(xhr.status);
    })
}

function getSWRegistration() {
    return navigator.serviceWorker.register('sw.js');
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

function getOsInfo() {
    try {
        var os = "unknown";
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;

        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = "unknown";

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }
        osVersion = osVersion.replace(/_/g, ".");
        return {name:os, version:osVersion};
    }catch (e) {
        console.log(e);
    }
}

function getBrowserInfo() {
    try {
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

function isMobile() {
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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

function checkMouse(e) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName === "HTML") {
        document.getElementById('popup').style.display = "block";
    }
}