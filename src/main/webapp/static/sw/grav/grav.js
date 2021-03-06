function in_array(f, d, c) {
    var b, g = !1, c = !!c;
    for (b in d) {
        if (c && d[b] === f || !c && d[b] == f) {
            g = !0;
            break
        }
    }
    return g
}

function boolFromStr(a) {
    return a === "true"
}

window.Gravitec || (window.Gravitec = []);
var tempGravitec = null;
if ("undefined" !== typeof Gravitec) {
    tempGravitec = Gravitec
}
var grIsHTTP = boolFromStr("false");
var Gravitec = {
    Event: Event,
    Notification: window.Notification,
    sdkVersion: "30-07-2018",
    hostUrl: "https://uapi.gravitec.net/",
    logging: true,
    initParams: null,
    gravitecPushDb: null,
    messageListener: null,
    doTrace: false,
    doAnalyticsLog: false,
    analyticsLogPrefix: "analytics.http" + (grIsHTTP ? "" : "s"),
    appKey: "678956a47c77ce5adec070aef3dd465e",
    autoRegister: boolFromStr("true"),
    subdomainName: "",
    gravitecMode: null,
    isHttp: grIsHTTP,
    webSiteDomain: "https://tesorin.com/evif-hotnews/landing3",
    subdomainFull: "https://push.gravitec.net",
    deviceToken: null,
    safariFirstPrompt: null,
    isGravitecSubdomain: true,
    safariID: "",
    charset: "UTF-8",
    initialSubscriptionChecked: false,
    api: {
        check: {url: "api/sites/followers/exist", method: "GET"},
        subscribe: {url: "api/sites/followers", method: "POST"},
        unsubscribe: {url: "api/sites/followers", method: "DELETE"},
        tag: {
            set: {url: "api/sites/followers/tags", method: "PUT"},
            remove: {url: "api/sites/followers/tags", method: "DELETE"},
            add: {url: "api/sites/followers/tags", method: "POST"},
            add_list: {url: "api/sites/followers/tags", method: "PATCH"},
            getAll: {url: "api/sites/followers/tags", method: "GET"}
        },
        alias: {set: {url: "api/sites/followers/aliases", method: "POST"}}
    },
    _noop: function () {
    },
    _log: function () {
        return Gravitec.logging && console.log(arguments)
    },
    init: function (b) {
        Gravitec._sendTraceLog("Client trace log init", "init executed");
        Gravitec._sendAnalyticsLog("init");
        if (Gravitec.isHttp) {
            Gravitec.checkingCharset(Gravitec.charset)
        }
        if (Gravitec._checkBrowser()) {
            if (typeof b !== "undefined") {
                Gravitec._sendTraceLog("Client trace log init", "inited with init params " + JSON.stringify(b));
                Gravitec.initParams = b;
                if (Gravitec.initParams._createLineWidget && Gravitec.initParams._createLineWidget.init) {
                    Gravitec._subscribeWithWidget(false, true)
                }
                if (Gravitec.initParams._createButton) {
                    Gravitec._subscribeWithWidget(true)
                }
                if (!Gravitec.initParams.autoRegister) {
                    Gravitec.autoRegister = false
                }
            }
            Gravitec._sendAnalyticsLog("init.preload");
            if (document.readyState === "complete") {
                a()
            } else {
                window.addEventListener("load", a)
            }
        }

        function a() {
            Gravitec._sendAnalyticsLog("init.loaded");
            Gravitec._sendTraceLog("Client trace log init", "window loaded");
            if (Gravitec.gravitecMode === "chrome") {
                Gravitec._sendTraceLog("Client trace log init", "chrome detected");
                if (!Gravitec.isHttp) {
                    Gravitec._sendTraceLog("Client trace log init", "is https");
                    Gravitec._addManifest();
                    Gravitec._initWorker()
                }
            }
            if (Gravitec.autoRegister) {
                Gravitec._sendAnalyticsLog("init.loaded.autoreg");
                Gravitec._sendTraceLog("Client trace log init", "is autoregister");
                if (Gravitec.gravitecMode === "safari") {
                    Gravitec._sendTraceLog("Client trace log init", "is safari");
                    Gravitec._subscribeSafari();
                    return
                }
                if (Gravitec.isHttp) {
                    Gravitec._sendTraceLog("Client trace log init", "is autoregister and http");
                    Gravitec._subscribeWithWidget(false, false, true);
                    return
                }
                Gravitec._sendTraceLog("Client trace log init", "starting registering user");
                Gravitec.push(["registerUserForPush"])
            }
        }
    },
    push: function (b) {
        var a;
        if ("function" === typeof b) {
            b()
        } else {
            a = b.shift();
            Gravitec[a].apply(null, b)
        }
    },
    afterSubscription: function (a) {
        a = a || Gravitec._noop;
        document.addEventListener("gravitecresult", function () {
            return a(Gravitec.deviceToken)
        }, false)
    },
    checkingCharset: function (a) {
        if (a.toUpperCase() !== document.characterSet.toUpperCase()) {
            Gravitec._send(Gravitec.hostUrl + "api/sites/charset", "post", {
                appKey: Gravitec.appKey,
                charset: document.characterSet
            })
        }
    },
    registerUserForPush: function (a) {
        Gravitec._sendAnalyticsLog("register");
        a = a || Gravitec._noop;
        if (Gravitec.gravitecMode === "safari") {
            Gravitec._sendAnalyticsLog("register.safari");
            Gravitec._subscribeSafari()
        } else {
            if (Gravitec.isHttp && Gravitec.subdomainName) {
                Gravitec._sendTraceLog("Client trace log register", "registering http");
                Gravitec._subscribeWithWidget(false, false, true, a)
            } else {
                Gravitec._sendTraceLog("Client trace log register", "getting subscription");
                Gravitec._getSubscription(function (b) {
                    Gravitec._sendTraceLog("Client trace log register", "got subscription " + JSON.stringify(b));
                    if (b && b.regID) {
                        Gravitec._sendAnalyticsLog("register.alreadysubscribed");
                        Gravitec._isSubscriptionChanged(b);
                        return a(b)
                    } else {
                        Gravitec._sendTraceLog("Client trace log register", "subscribing");
                        Gravitec._subscribe(function (c) {
                            Gravitec._sendAnalyticsLog(c ? "register.success" : "register.error");
                            Gravitec._sendTraceLog("Client trace log register", "subscribe value " + JSON.stringify(c));
                            if (c) {
                                Gravitec._putValueToDb("Ids", {type: "SubscriptionId", value: c});
                                Gravitec._sendTraceLog("Client trace log register", "sending subscription");
                                Gravitec._registerNewUser(c, function (d) {
                                    if (d) {
                                        Gravitec._createOnResultEvent(c);
                                        return a(c)
                                    }
                                })
                            } else {
                                Gravitec._createOnResultEvent(c);
                                return a(c)
                            }
                        })
                    }
                })
            }
        }
    },
    unSubscribe: function () {
        navigator.serviceWorker.ready.then(function (a) {
            a.pushManager.getSubscription().then(function (c) {
                if (c) {
                    var b = Gravitec._prepareId(c);
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.unsubscribe.url, Gravitec.api.unsubscribe.method, {regID: b.regID}, function () {
                        Gravitec._log("User unsubscribed successfully")
                    });
                    c.unsubscribe()
                }
            })["catch"](function (b) {
                Gravitec._log("Error during getSubscription()", b)
            })
        })
    },
    getSubscription: function (a) {
        Gravitec._getSubscription(function (b) {
            (a || Gravitec._noop)(b && b.regID ? b : null)
        })
    },
    _getSubscription: function (a) {
        a = a || Gravitec._noop;
        if ("chrome" === Gravitec.gravitecMode) {
            if (Gravitec.isHttp) {
                Gravitec._getDbValue("Ids", "SubscriptionId", function (b) {
                    return a.apply(null, b.target.result ? [b.target.result.value] : [])
                })
            } else {
                navigator.serviceWorker.ready.then(function (b) {
                    b.pushManager.getSubscription().then(function (f) {
                        var d = f;
                        if (!f) {
                            return a(null)
                        }
                        var c = Gravitec._prepareId(d);
                        if (Gravitec.initialSubscriptionChecked) {
                            return a(c)
                        }
                        Gravitec._getDbValue("Ids", "SubscriptionId", function (h) {
                            if (h.target.result) {
                                g(h.target.result.value)
                            } else {
                                g(null)
                            }
                        }, function () {
                            return g(null)
                        });

                        function g(h) {
                            if (!h) {
                                Gravitec._checkRemoteSubscription(c.regID).then(function () {
                                    Gravitec.initialSubscriptionChecked = true;
                                    a(c)
                                }, function () {
                                    Gravitec.initialSubscriptionChecked = true;
                                    f.unsubscribe().then(function () {
                                        a(null)
                                    }, function () {
                                        a(null)
                                    })
                                })
                            } else {
                                Gravitec.initialSubscriptionChecked = true;
                                a(c)
                            }
                        }
                    })["catch"](function () {
                        Gravitec.initialSubscriptionChecked = true;
                        a(null)
                    })
                })
            }
        } else {
            if ("safari" === Gravitec.gravitecMode) {
                Gravitec._subscribeSafari();
                a(window.safari.pushNotification.permission(Gravitec.safariID))
            } else {
                a(false)
            }
        }
    },
    _checkRemoteSubscription: function (a) {
        return new Promise(function (d, b) {
            var c = new URL(Gravitec.hostUrl + Gravitec.api.check.url);
            c.searchParams.append("regID", a);
            Gravitec._send(c.href, Gravitec.api.check.method, null, function (f) {
                if (f.value) {
                    return d()
                }
                return b()
            }, function () {
                return b()
            })
        })
    },
    getTags: function (b, a) {
        if (typeof b === "string" || typeof b === "number" || typeof a === "string" || typeof a === "number") {
            throw new Error("Gravitec: Wrong parameter")
        }
        b = b || Gravitec._noop;
        a = a || Gravitec._noop;
        if (arguments.length <= 2) {
            Gravitec._getSubscription(function (c) {
                var d = c && (typeof c === "string" ? c : c.regID || c.deviceToken);
                if (d) {
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.add.url + "?regID=" + d, Gravitec.api.tag.getAll.method, null, function (f) {
                        return b && b(f)
                    }, function (f) {
                        a(f)
                    })
                } else {
                    throw new Error("WLPush: User has to subscribe at first")
                }
            })
        } else {
            throw new Error("Gravitec: There`re 3 an extra parameter when calling function")
        }
    },
    addTag: function (a, c, b) {
        c = c || Gravitec._noop;
        b = b || Gravitec._noop;
        if (a && a.replace(/\s/g, "").length > 0) {
            Gravitec._getSubscription(function (f) {
                var g = f && (typeof f === "string" ? f : f.regID || f.deviceToken);
                if (g) {
                    var d = [a];
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.add.url + "?regID=" + g, Gravitec.api.tag.add.method, d, function () {
                        Gravitec._log("Tag added " + a);
                        c()
                    }, function (h) {
                        b(h)
                    })
                } else {
                    throw new Error("Gravitec: User has to subscribe at first")
                }
            })
        } else {
            throw new Error("Gravitec: tagName must be not empty")
        }
    },
    setTags: function (a, d, c) {
        d = d || Gravitec._noop;
        c = c || Gravitec._noop;
        if (Array.isArray(a) && a.length) {
            for (var b = 0; b < a.length; b++) {
                if (!a[b] && !(a[b].replace(/\s/g, "").length > 0)) {
                    throw new Error("Gravitec: tagName must be not empty")
                }
            }
        } else {
            throw new Error("Gravitec: tagNames must be valid array")
        }
        Gravitec._getSubscription(function (f) {
            var g = f && (typeof f === "string" ? f : f.regID);
            if (g) {
                Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.set.url + "?regID=" + g, Gravitec.api.tag.set.method, a, function () {
                    Gravitec._log("Tag names has set: " + a.join(", "));
                    d()
                }, function (h) {
                    c(h)
                })
            } else {
                throw new Error("Gravitec: User has to subscribe at first")
            }
        })
    },
    addTags: function (a, d, c) {
        d = d || Gravitec._noop;
        c = c || Gravitec._noop;
        if (Array.isArray(a) && a.length) {
            for (var b = 0; b < a.length; b++) {
                if (!a[b] && !(a[b].replace(/\s/g, "").length > 0)) {
                    throw new Error("Gravitec: tagName must be not empty")
                }
            }
        } else {
            throw new Error("Gravitec: tagNames must be valid array")
        }
        Gravitec._getSubscription(function (f) {
            var g = f && (typeof f === "string" ? f : f.regID);
            if (g) {
                Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.add_list.url + "?regID=" + g, Gravitec.api.tag.add_list.method, a, function () {
                    Gravitec._log("Tag names has been added: " + a.join(", "));
                    d()
                }, function (h) {
                    c(h)
                })
            } else {
                throw new Error("Gravitec: User has to subscribe at first")
            }
        })
    },
    removeTag: function (a, c, b) {
        c = c || Gravitec._noop;
        c = c || Gravitec._noop;
        if (a && a.replace(/\s/g, "").length > 0) {
            Gravitec._getSubscription(function (d) {
                var f = d && (typeof d === "string" ? d : d.regID);
                if (f) {
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.remove.url + "?regID=" + f, Gravitec.api.tag.remove.method, [a], function () {
                        Gravitec._log("Removed tag " + a);
                        c()
                    }, function (g) {
                        b(g)
                    })
                } else {
                    throw new Error("Gravitec: User has to subscribe at first")
                }
            })
        } else {
            throw new Error("Gravitec: tagName must be not empty")
        }
    },
    removeAllTags: function (b, a) {
        if (typeof b === "string" || typeof b === "number" || typeof a === "string" || typeof a === "number") {
            throw new Error("Gravitec: Wrong parameter")
        }
        b = b || Gravitec._noop;
        a = a || Gravitec._noop;
        if (arguments.length <= 2) {
            Gravitec._getSubscription(function (c) {
                var d = c && (typeof c === "string" ? c : c.regID);
                if (d) {
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.tag.remove.url + "?regID=" + d, Gravitec.api.tag.remove.method, [], function () {
                        Gravitec._log("Removed all tags");
                        b()
                    }, function (f) {
                        a(f)
                    })
                } else {
                    throw new Error("Gravitec: User has to subscribe at first")
                }
            })
        } else {
            throw new Error("Gravitec: There`re 3 an extra parameter when calling function")
        }
    },
    setAlias: function (a, c, b) {
        c = c || Gravitec._noop;
        b = b || Gravitec._noop;
        if (a.length > 0 && a.replace(/\s/g, "").length) {
            Gravitec._getSubscription(function (d) {
                var f = d && (typeof d === "string" ? d : d.regID);
                if (f) {
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.alias.set.url + "?regID=" + f, Gravitec.api.alias.set.method, a, function () {
                        Gravitec._log("Setted alias " + a);
                        c()
                    }, function (g) {
                        b(g)
                    })
                } else {
                    throw new Error("Gravitec: User has to subscribe at first")
                }
            })
        } else {
            throw new Error("Gravitec: aliasName must be not empty")
        }
    },
    _processPushes: function (b) {
        for (var a = 0; a < b.length; a++) {
            Gravitec.push(b[a])
        }
    },
    _addManifest: function () {
        var a = document.createElement("link");
        a.rel = "manifest";
        a.href = "/manifest.json";
        document.head.appendChild(a);
        Gravitec._sendTraceLog("Client trace log", "manifest added to head")
    },
    _createOnResultEvent: function (b) {
        Gravitec.deviceToken = b;
        var a = new Gravitec.Event("gravitecresult");
        document.dispatchEvent(a)
    },
    _subscribeSafari: function () {
        if (Gravitec.gravitecMode === "safari") {
            var a = window.safari.pushNotification.permission(Gravitec.safariID);
            Gravitec._checkRemotePermission(a, function (b) {
                if (b && Gravitec.safariFirstPrompt) {
                    Gravitec._createOnResultEvent(b);
                    Gravitec.safariFirstPrompt = null
                }
            })
        }
    },
    _removeJeapieGID: function () {
        var a = indexedDB.open("jeapie_push_sdk_db", true);
        a.onsuccess = function (d) {
            var c = d.target.result;
            var g = c.transaction("Ids");
            var f = g.objectStore("Ids");
            f.get("SubscriptionId").onsuccess = function (h) {
                if (!h.target.result || !h.target.result.value) {
                    b();
                    return
                }
                Gravitec._send(Gravitec.hostUrl + Gravitec.api.unsubscribe.url, Gravitec.api.unsubscribe.method, {regID: h.target.result.value}, function () {
                    b()
                })
            }
        };
        a.onupgradeneeded = function (d) {
            var c = d.target.result;
            c.createObjectStore("Ids", {keyPath: "type"})
        };

        function b() {
            var c = indexedDB.deleteDatabase("jeapie_push_sdk_db");
            c.onsuccess = function () {
                Gravitec._log("Jeapie db removed")
            };
            c.onerror = function () {
                Gravitec._log("Error removing jeapie db")
            }
        }
    },
    _initDb: function (b) {
        b = b || Gravitec._noop;
        if (Gravitec.gravitecPushDb) {
            return void b()
        }
        var a = indexedDB.open("gravitec_push_sdk_db", true);
        a.onsuccess = function (c) {
            Gravitec.gravitecPushDb = c.target.result;
            b()
        };
        a.onupgradeneeded = function (d) {
            var c = d.target.result;
            c.createObjectStore("Ids", {keyPath: "type"});
            c.createObjectStore("HttpCreated", {keyPath: "type"})
        }
    },
    _getDbValue: function (b, a, d, c) {
        d = d || Gravitec._noop;
        Gravitec._initDb(function () {
            Gravitec.gravitecPushDb.transaction(b).objectStore(b).get(a).onsuccess = d;
            Gravitec.gravitecPushDb.transaction(b).objectStore(b).get(a).onerror = c
        })
    },
    _getAllValues: function (a, b) {
        b = b || Gravitec._noop;
        Gravitec._initDb(function () {
            var c = {};
            Gravitec.gravitecPushDb.transaction(a).objectStore(a).openCursor().onsuccess = function (d) {
                var f = d.target.result;
                if (f) {
                    c[f.key] = f.value.value;
                    f["continue"]()
                } else {
                    b(c)
                }
            }
        })
    },
    _putValueToDb: function (a, b) {
        Gravitec._initDb(function () {
            Gravitec.gravitecPushDb.transaction([a], "readwrite").objectStore(a).put(b)
        })
    },
    _deleteDbValue: function (b, a, d, c) {
        d = d || Gravitec._noop;
        c = c || Gravitec._noop;
        Gravitec._initDb(function () {
            Gravitec.gravitecPushDb.transaction([b], "readwrite").objectStore(b)["delete"](a).onsuccess = d;
            Gravitec.gravitecPushDb.transaction([b], "readwrite").objectStore(b)["delete"](a).onerror = c
        })
    },
    _initWorker: function () {
        Gravitec._sendTraceLog("Client trace log init", "initing worker");
        var a = navigator.serviceWorker.controller;
        if (a && a.scriptURL.match(/\/push-worker\.js$/)) {
            return
        }
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/push-worker.js").then(function () {
                Gravitec._sendTraceLog("Client trace log init", "worker registered");
                Gravitec._log("Worker registered")
            })["catch"](function (b) {
                Gravitec._sendTraceLog("Client trace log init", "worker not registered");
                Gravitec._log(b);
                return false
            })
        }
    },
    _sendTraceLog: function (b, c, a) {
        if (Gravitec.doTrace) {
            Gravitec._send(Gravitec.hostUrl + "api/sites/traceclientjs/?version=" + Gravitec.sdkVersion + (a ? ("&token=" + a) : ""), "post", (b ? (b + ": ") : "") + c)
        }
    },
    _sendAnalyticsLog: function (c, a) {
        var b;
        if (Gravitec.doAnalyticsLog) {
            b = Gravitec.analyticsLogPrefix + "." + c;
            Gravitec._send(Gravitec.hostUrl + "api/sites/traceclientjs/?version=" + Gravitec.sdkVersion + (a ? ("&token=" + a) : "") + "&log=" + b + "&browser=" + Gravitec.getBrowser(), "post", b)
        }
    },
    _send: function (b, i, d, h, g) {
        h = h || Gravitec._noop;
        g = g || Gravitec._noop;
        var c = [b, i];
        b += (b.indexOf("?") > -1 ? "&" : "?") + "app_key=" + Gravitec.appKey;
        if ("chrome" == Gravitec.gravitecMode) {
            var a = {method: i, headers: {"Content-Type": "application/json"}};
            if (d) {
                a.body = JSON.stringify(d)
            }
            fetch(b, a).then(function (j) {
                if (j.status > 304) {
                    Gravitec._log("Looks like there was a problem. Status Code: " + j.status);
                    g(j)
                } else {
                    return void j.json().then(function (k) {
                        if (k.error && k.message === "The subscriber already unsubscribed!") {
                            return h(k)
                        }
                        if (k.error) {
                            return g(k)
                        } else {
                            return h(k)
                        }
                    })["catch"](function (k) {
                        if (c[0].match(/followers\?/) && c[1] === "DELETE") {
                            return h(k)
                        }
                        return g(k)
                    })
                }
            })["catch"](function (j) {
                Gravitec._log("Fetch Error :-S", j);
                return g(j)
            })
        } else {
            var f = new XMLHttpRequest;
            f.open(i, b, true);
            f.setRequestHeader("Content-Type", "application/json");
            f.onreadystatechange = function () {
                if (4 == f.readyState) {
                    if (f.status > 304) {
                        Gravitec._log("Looks like there was a problem. Status Code: " + f.status);
                        g(f);
                        return
                    }
                    Gravitec._log("data successfully sent");
                    return h(f.responseText)
                }
            };
            f.send(d ? JSON.stringify(d) : null)
        }
    },
    _getGetUrlWithObject: function (a, b) {
        return a + "?app_key=" + Gravitec.appKey + "&data=" + JSON.stringify(b)
    },
    _checkRemotePermission: function (a, b) {
        b = b || Gravitec._noop;
        if ("default" === a.permission) {
            Gravitec.safariFirstPrompt = true;
            window.safari.pushNotification.requestPermission(Gravitec.hostUrl, Gravitec.safariID, {}, function (c) {
                Gravitec._checkRemotePermission(c, b)
            })
        } else {
            if ("denied" === a.permission) {
                return b()
            }
            if ("granted" === a.permission) {
                Gravitec._isSubscriptionChanged(a.deviceToken);
                return b(a.deviceToken)
            }
        }
    },
    _registerHttp: function (j) {
        j = j || function () {
        };
        if ("safari" == Gravitec.gravitecMode) {
            Gravitec._subscribeSafari()
        } else {
            if (!Gravitec.isHttp || !Gravitec.subdomainName || !Gravitec.isPushManagerSupported()) {
                j(null);
                return
            }
            var b = void 0 != window.screenLeft ? window.screenLeft : screen.left,
                g = void 0 != window.screenTop ? window.screenTop : screen.top,
                a = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
                k = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
                i = Gravitec.detectBrowser().name === "Chrome" || Gravitec.detectBrowser().name === "Opera" ? 640 : 100,
                d = Gravitec.detectBrowser().name === "Chrome" || Gravitec.detectBrowser().name === "Opera" ? 661 : 100,
                c = Gravitec.detectBrowser().name === "Chrome" || Gravitec.detectBrowser().name === "Opera" ? a / 2 - i / 2 + b : 0 - window.innerWidth,
                m = Gravitec.detectBrowser().name === "Chrome" || Gravitec.detectBrowser().name === "Opera" ? k / 2 - d / 2 + g : window.innerHeight - d,
                f = window.open(Gravitec.subdomainFull + "/index.html", "_blank", "scrollbars=yes, width=" + i + ", height=" + d + ", top=" + m + ", left=" + c);
            if (f) {
                f.focus();
                Gravitec._createMessageListener(j)
            }
        }
    },
    isSubscribed: function (b) {
        b = b || Gravitec._noop;
        if ("safari" === Gravitec.gravitecMode) {
            var a = window.safari.pushNotification.permission(Gravitec.safariID).permission;
            return b("granted" == a)
        }
        Gravitec._getSubscription(function (c) {
            return b(!!c)
        })
    },
    _isSubscriptionChanged: function (b) {
        if (!b || !b.regID) {
            Gravitec._subscribe(a);
            return
        }
        Gravitec._getDbValue("Ids", "SubscriptionId", function (c) {
            if (c.target.result && c.target.result.value) {
                if (c.target.result.value.regID !== b.regID) {
                    Gravitec._send(Gravitec.hostUrl + Gravitec.api.subscribe.url + "/" + c.target.result.value.regID, "PUT", b, function (d) {
                        if (d) {
                            Gravitec._createOnResultEvent(b)
                        }
                    })
                }
            } else {
                a(b)
            }
        });

        function a(c) {
            if ("safari" != Gravitec.gravitecMode) {
                Gravitec._putValueToDb("Ids", {type: "SubscriptionId", value: c});
                Gravitec._registerNewUser(c, function (d) {
                    if (d) {
                        Gravitec._createOnResultEvent(c)
                    }
                })
            }
        }
    },
    _subscribeWithWidget: function (b, a, c, d) {
        Gravitec._isIncognito().then(function () {
            if (Gravitec.gravitecMode == "chrome") {
                if (Gravitec.isHttp) {
                    Gravitec._getDbValue("Ids", "SubscriptionId", function (f) {
                        if (f.target.result) {
                            if (Gravitec.isGravitecSubdomain && !Gravitec._checkCookie("gravitecPromptShowed") && !Gravitec._checkCookie("gravitecBlocked") && !Gravitec._checkCookie("jeapiePromptShowed") && !Gravitec._checkCookie("dontShowPrompt")) {
                                Gravitec._appendWidgets(b, a, c, d)
                            } else {
                                Gravitec._getDbValue("HttpCreated", "subscribedTime", function (g) {
                                    if (g.target.result) {
                                        var h = Gravitec.getCurrentTimestamp();
                                        var i = g.target.result.value;
                                        var j = h - i;
                                        if (j > 5184000) {
                                            Gravitec._appendWidgets(b, a, c, d)
                                        } else {
                                            Gravitec._sendAnalyticsLog("timenotexpired")
                                        }
                                    } else {
                                        Gravitec._sendAnalyticsLog("nosubscribetime")
                                    }
                                })
                            }
                        } else {
                            if (!Gravitec._checkCookie("gravitecBlocked")) {
                                Gravitec._appendWidgets(b, a, c, d)
                            } else {
                                Gravitec._sendAnalyticsLog("subdomainblocked")
                            }
                        }
                    })
                } else {
                    Gravitec._getSubscription(function (f) {
                        if (!f) {
                            Gravitec._appendWidgets(b, a, c, d)
                        }
                        Gravitec._sendAnalyticsLog("httpsdetected.nosubscription")
                    })
                }
            } else {
                Gravitec._sendAnalyticsLog("notsupported.widgetdismissed")
            }
        })
    },
    _appendWidgets: function (f, d, c, g) {
        Gravitec._sendAnalyticsLog("register.widget");
        if (c && Gravitec._createNativePrompt(g), f && Gravitec._createButton(), d && Gravitec._createLine(), null === document.getElementById("gravitec-button-style")) {
            var b = document.getElementsByTagName("head")[0];
            var h = document.createElement("link");
            h.id = "gravitec-button-style";
            h.rel = "stylesheet";
            h.type = "text/css";
            h.href = "https://cdn.gravitec.net/style/pushbutton.css";
            h.media = "all";
            b.appendChild(h)
        }
    },
    _createButton: function () {
        Gravitec._sendAnalyticsLog("register.widget.button");

        function k() {
            setInterval(function () {
                var a = document.getElementById("gravitec-push-container");
                a.className = a.className + " gravitec-shake-animated gravitec-shake";
                setTimeout(function () {
                    a.className = ""
                }, 1000)
            }, 90000)
        }

        function j() {
            document.getElementById("gravitec-push-tooltip").style.display = "block", document.getElementById("gravitec-push-dont-show").style.display = "block"
        }

        function u() {
            document.getElementById("gravitec-push-tooltip").style.display = "block"
        }

        function q() {
            document.getElementById("gravitec-push-tooltip").style.display = "none", setTimeout(function () {
                document.getElementById("gravitec-push-dont-show").style.display = "none"
            }, 6000)
        }

        function h() {
            Gravitec._setCookie("dontShowButton", true, 7), Gravitec._removeWidget(["gravitec-push-container"])
        }

        if (!Gravitec._checkCookie("dontShowButton")) {
            Gravitec.initParams.tooltipText || (Gravitec.initParams.tooltipText = "ÐŸÐ¾Ð´Ð¿Ð¸ÑˆÐ¸Ñ‚ÐµÑÑŒ Ð½Ð° Ð½Ð°ÑˆÐ¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ Ð² Ð¾Ð´Ð¸Ð½ ÐºÐ»Ð¸Ðº!");
            var g = document.createElement("button");
            g.id = "gravitec-push-button";
            var b = document.createElement("span");
            b.id = "gravitec-push-tooltip";
            var f = document.createTextNode(Gravitec.initParams.tooltipText);
            b.appendChild(f);
            var v = document.createElement("span");
            v.id = "gravitec-push-dont-show";
            var m = document.createTextNode("x");
            v.appendChild(m);
            var l = document.createElement("div");
            l.id = "gravitec-push-container", l.appendChild(g), l.appendChild(b), l.appendChild(v), Gravitec._checkCookie("firstSeen") ? (document.body.appendChild(l), k(), document.getElementById("gravitec-push-button").onmouseover = j, document.getElementById("gravitec-push-button").onmouseout = q, document.getElementById("gravitec-push-button").onclick = Gravitec._registerOnWidgetClick, document.getElementById("gravitec-push-dont-show").onclick = h) : setTimeout(function () {
                document.body.appendChild(l), Gravitec._setCookie("firstSeen", true, 30);
                var a = document.getElementById("gravitec-push-container");
                a.className = a.className + " gravitec-animated gravitec-rollin", setTimeout(function () {
                    u()
                }, 1000), setTimeout(function () {
                    q(), a.className = ""
                }, 3000), k(), document.getElementById("gravitec-push-button").onmouseover = j, document.getElementById("gravitec-push-button").onmouseout = q, document.getElementById("gravitec-push-button").onclick = Gravitec._registerOnWidgetClick, document.getElementById("gravitec-push-dont-show").onclick = h
            }, 2000), Gravitec._createMessageListener()
        }
    },
    _createNativePrompt: function (y) {
        Gravitec._sendAnalyticsLog("register.widget.prompt");
        if (!Gravitec._checkCookie("dontShowPrompt")) {
            if (Gravitec.detectBrowser().name === "Chrome" || Gravitec.detectBrowser().name === "Opera") {
                if (Gravitec.isMobileScreen()) {
                    return Gravitec.initParams = {
                        _createLineWidget: {
                            init: true,
                            background: "#1ab394",
                            color: "#fff",
                            text: "Opt-in for notifications",
                            position: "bottom",
                            showbell: false,
                            showInsteadPrompt: true
                        }
                    }, void Gravitec._createLine()
                }
                var H = " wants to:", D = "Show notifications", q = "Allow", L = "Block";
                var A = document.createElement("div");
                A.id = "gravitec-prompt-widget";
                if ("ru" == Gravitec.getBrowserlanguage() || "uk" == Gravitec.getBrowserlanguage() || "be" == Gravitec.getBrowserlanguage()) {
                    H = " Ð·Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°ÐµÑ‚ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð½Ð°:";
                    D = "ÐŸÐ¾ÐºÐ°Ð·Ñ‹Ð²Ð°Ñ‚ÑŒ Ð¾Ð¿Ð¾Ð²ÐµÑ‰ÐµÐ½Ð¸Ñ";
                    q = "Ð Ð°Ð·Ñ€ÐµÑˆÐ¸Ñ‚ÑŒ";
                    L = "Ð‘Ð»Ð¾ÐºÐ¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ";
                    A.className = "gravitec-ru-block"
                } else {
                    if ("pl" == Gravitec.getBrowserlanguage()) {
                        H = " chce:";
                        D = "PokazywaÄ‡ powiadomienia";
                        q = "Zezwalaj";
                        L = "Blokuj"
                    }
                }
                var z = document.createElement("div");
                z.id = "gravitec-prompt-closer";
                var x = document.createElement("span");
                x.id = "gravitec-prompt-closer-char";
                z.appendChild(x);
                var K = document.createElement("div");
                K.id = "gravitec-prompt-domain-name";
                var w = document.createTextNode(window.location.origin + H);
                K.appendChild(w);
                var I = "f0 9f 94 94", p = decodeURIComponent(I.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&"));
                p += "  ";
                var C = document.createElement("div");
                C.id = "gravitec-prompt-bell-text";
                var B = document.createTextNode(D);
                C.appendChild(B);
                var F = document.createElement("div");
                F.id = "gravitec-prompt-buttons";
                "ru" != Gravitec.getBrowserlanguage() && "uk" != Gravitec.getBrowserlanguage() || (F.className = "gravitec-prompt-buttons-ru", z.className = "gravitec-prompt-closer-ru");
                var G = document.createElement("button");
                G.id = "gravitec-prompt-allow-button";
                G.className = "gravitec-prompt-button";
                var j = document.createTextNode(q);
                G.appendChild(j);
                var E = document.createElement("button");
                E.id = "gravitec-prompt-block-button";
                E.className = "gravitec-prompt-button";
                var k = document.createTextNode(L);
                E.appendChild(k);
                F.appendChild(G);
                F.appendChild(E);
                A.appendChild(z);
                A.appendChild(K);
                A.appendChild(C);
                A.appendChild(F);
                document.body.appendChild(A);
                document.getElementById("gravitec-prompt-closer-char").addEventListener("click", function (a) {
                    Gravitec._sendAnalyticsLog("register.widget.prompt.close");
                    a.preventDefault();
                    Gravitec._removeWidget(["gravitec-prompt-widget"]);
                    Gravitec._sendTraceLog("Client trace log register widget", "canceled")
                });
                document.getElementById("gravitec-prompt-block-button").addEventListener("click", function (a) {
                    Gravitec._sendAnalyticsLog("register.widget.prompt.block");
                    a.preventDefault();
                    Gravitec._setCookie("dontShowPrompt", true, 7);
                    Gravitec._removeWidget(["gravitec-prompt-widget"]);
                    Gravitec._sendTraceLog("Client trace log register widget", "blocked")
                });
                document.getElementById("gravitec-prompt-allow-button").addEventListener("click", function (a) {
                    Gravitec._sendAnalyticsLog("register.widget.prompt.allow");
                    a.preventDefault();
                    Gravitec._removeWidget(["gravitec-prompt-widget"]);
                    Gravitec._registerOnWidgetClick(y);
                    Gravitec._sendTraceLog("Client trace log register widget", "allowed")
                })
            } else {
                var b = document.createElement("iframe");
                b.src = Gravitec.subdomainFull + "/subscribe.html";
                b.style.display = "none";
                window.addEventListener("message", function (c) {
                    if (c.origin.indexOf(Gravitec.subdomainFull) == 0) {
                        var a = c.data.subscribed;
                        switch (a) {
                            case"default":
                                Gravitec._sendAnalyticsLog("register.widget.prompt.close");
                                Gravitec._sendTraceLog("Client trace log register widget", "canceled");
                                break;
                            case"granted":
                                Gravitec._sendAnalyticsLog("register.widget.prompt.allow");
                                Gravitec._createModal(function () {
                                    let modalWrapper = document.getElementById("gravitec-modal");
                                    document.getElementById("gravitec-modal").addEventListener("click", function (d) {
                                        modalWrapper.classList.add("cant-click");
                                        if (d.target.tagName !== "A") {
                                            Gravitec._registerOnModalClick();
                                            d.stopPropagation()
                                        }
                                    });
                                    document.getElementById("gravitec-modal-close").addEventListener("click", function (d) {
                                        modalWrapper.classList.add("cant-click");
                                        Gravitec._registerOnModalClick();
                                        modalWrapper.classList.remove("cant-click")
                                    });
                                    document.getElementById("gravitec-modal-body").addEventListener("click", function (d) {
                                        modalWrapper.classList.add("cant-click");
                                        d.stopPropagation();
                                        modalWrapper.classList.remove("cant-click")
                                    });
                                    document.getElementById("gravitec-modal-body-close").addEventListener("click", function (d) {
                                        modalWrapper.classList.add("cant-click");
                                        d.preventDefault();
                                        d.stopPropagation();
                                        Gravitec._registerOnModalClick();
                                        modalWrapper.classList.remove("cant-click")
                                    })
                                });
                                break;
                            case"denied":
                                Gravitec._sendAnalyticsLog("register.widget.prompt.block");
                                Gravitec._setCookie("dontShowPrompt", true, 7);
                                Gravitec._sendTraceLog("Client trace log register widget", "blocked");
                                break
                        }
                    }
                });
                document.body.appendChild(b)
            }
        }
    },
    _createModal: function (p) {
        var c = {
            message: {
                ru: "Ð’Ñ‹ Ð¿Ð¾Ð´Ð¿Ð¸ÑÐ°Ð»Ð¸ÑÑŒ Ð½Ð° ÑƒÐ²ÐµÐ´Ð¾Ð¼Ð»ÐµÐ½Ð¸Ñ Ð¾Ñ‚ https://tesorin.com/evif-hotnews/landing3",
                en: "You have subscribed to notifications from https://tesorin.com/evif-hotnews/landing3",
                pl: "ZarejestrowaÅ‚eÅ› siÄ™ do powiadomieÅ„ ze strony https://tesorin.com/evif-hotnews/landing3"
            }, button: {ru: "Ð¡Ð¿Ð°ÑÐ¸Ð±Ð¾ Ð·Ð° Ð¿Ð¾Ð´Ð¿Ð¸ÑÐºÑƒ", en: "Thank you", pl: "DziÄ™kujemy"}
        };
        var q = c.message.en;
        var m = c.button.en;
        if ("ru" == Gravitec.getBrowserlanguage() || "uk" == Gravitec.getBrowserlanguage() || "be" == Gravitec.getBrowserlanguage()) {
            q = c.message.ru;
            m = c.button.ru
        } else {
            if ("pl" == Gravitec.getBrowserlanguage()) {
                q = c.message.pl;
                m = c.button.pl
            }
        }
        var l = document.getElementsByTagName("head")[0];
        var j = document.createElement("link");
        j.id = "gravitec-modal-style";
        j.rel = "stylesheet";
        j.type = "text/css";
        j.href = "https://cdn.gravitec.net/style/modal.css";
        j.media = "all";
        l.appendChild(j);
        var o = document.createElement("div");
        o.id = "gravitec-modal";
        var n = document.createElement("div");
        n.className = "gravitec-modal-body";
        var g = document.createElement("div");
        g.innerHTML = "&#10006;";
        g.id = "gravitec-modal-close";
        var i = document.createElement("h1");
        i.className = "modal-body-text";
        i.id = "gravitec-modal-body";
        var h = document.createTextNode(q);
        i.appendChild(h);
        var b = document.createElement("button");
        b.className = "modal-body-button";
        b.id = "gravitec-modal-body-close";
        var f = document.createElement("span");
        f.className = "modal-body-button-text";
        var k = document.createTextNode(m);
        var d = document.createElement("p");
        d.className = "gravitec-modal-body-powered";
        d.innerHTML = 'Powered by <a href="https://gravitec.net/?utm_source=site&utm_medium=referral&utm_campaign=http" target="_blank">Gravitec.net</a>';
        f.appendChild(k);
        b.appendChild(f);
        n.appendChild(g);
        n.appendChild(i);
        n.appendChild(b);
        n.appendChild(d);
        o.appendChild(n);
        document.body.appendChild(o);
        return p()
    },
    _registerOnModalClick: function () {
        Gravitec._registerOnWidgetClick();
        Gravitec._removeWidget(["gravitec-modal"]);
        Gravitec._sendTraceLog("Client trace log register widget", "allowed")
    },
    _createLine: function () {
        Gravitec._sendAnalyticsLog("register.widget.line");

        function m() {
            var a = window.pageYOffset || document.documentElement.scrollTop;
            a > 150 ? k() : y()
        }

        function k() {
            "block" != h.style.display && (h.style.display = "block")
        }

        function y() {
            "block" == h.style.display && (h.style.display = "none")
        }

        if (!Gravitec._checkCookie("dontShowLine") && Gravitec.initParams._createLineWidget && Gravitec.initParams._createLineWidget.init) {
            var w = false;
            Gravitec.initParams._createLineWidget && Gravitec.initParams._createLineWidget.showInsteadPrompt && (w = true);
            var h = document.createElement("div");
            h.id = w ? "gravitec-line-widget-instead-prompt" : "gravitec-line-widget", h.style.background = Gravitec.initParams._createLineWidget.background || "#1ab394", h.style.color = Gravitec.initParams._createLineWidget.color || "#fff";
            var g = document.createElement("span");
            if (g.id = w ? "gravitec-line-text-instead-prompt" : "gravitec-line-text", Gravitec.initParams._createLineWidget.showbell) {
                var b = "f0 9f 94 94", f = decodeURIComponent(b.replace(/\s+/g, "").replace(/[0-9a-f]{2}/g, "%$&"));
                f += "  ";
                var z = document.createElement("span");
                z.id = "gravitec-bell-character";
                var v = document.createTextNode(f);
                z.appendChild(v), h.appendChild(z)
            }
            var q = document.createTextNode(Gravitec.initParams._createLineWidget.text || "We need your permissions to enable desktop notifications");
            g.appendChild(q);
            var x = document.createElement("a");
            x.id = w ? "gravitec-line-closer-instead-prompt" : "gravitec-line-closer", x.style.color = Gravitec.initParams._createLineWidget.color || "#fff";
            var q = document.createTextNode("x");
            x.appendChild(q), h.appendChild(g), h.appendChild(x), document.body.appendChild(h);
            var j = w ? "gravitec-line-closer-instead-prompt" : "gravitec-line-closer";
            document.getElementById(j).addEventListener("click", function (a) {
                a.preventDefault(), Gravitec.lineDeleted = true, Gravitec._setCookie("dontShowLine", true, 7), Gravitec._removeWidget([h.id])
            }), Gravitec.lineDeleted || (h.onclick = Gravitec._registerOnWidgetClick), onloadPosition = window.pageYOffset || document.documentElement.scrollTop, "top" != Gravitec.initParams._createLineWidget.position && Gravitec.initParams._createLineWidget.position ? (h.style.bottom = 0, k()) : (h.style.top = 0, onloadPosition > 150 && k(), window.addEventListener("scroll", m, false))
        }
    },
    _registerOnWidgetClick: function (a) {
        if (Gravitec.lineDeleted === "undefined" || !Gravitec.lineDeleted) {
            if ("safari" == Gravitec.gravitecMode) {
                Gravitec._removeWidget(["gravitec-line-widget", "gravitec-push-container", "gravitec-prompt-widget", "gravitec-line-widget-instead-prompt"]);
                Gravitec._subscribeSafari()
            } else {
                if (Gravitec.isHttp) {
                    Gravitec._registerHttp(a)
                } else {
                    Gravitec.registerUserForPush(function (b) {
                        if (b) {
                            Gravitec._removeWidget(["gravitec-line-widget", "gravitec-push-container", "gravitec-prompt-widget", "gravitec-line-widget-instead-prompt"])
                        }
                    })
                }
            }
        }
    },
    _createMessageListener: function (b) {
        b = b || function () {
        };

        function a(c) {
            if (c.data.httpRegistered === true) {
                Gravitec._putValueToDb("Ids", {type: "SubscriptionId", value: c.data.subscription});
                Gravitec._putValueToDb("HttpCreated", {type: "subscribedTime", value: Gravitec.getCurrentTimestamp()});
                if (Gravitec.isGravitecSubdomain) {
                    Gravitec._setCookie("gravitecPromptShowed", true, 60)
                }
            } else {
                if (c.data.httpRegistered === "blocked") {
                    if (Gravitec.isGravitecSubdomain) {
                        Gravitec._setCookie("gravitecBlocked", true, 30)
                    }
                } else {
                    if (c.data.httpRegistered === "default") {
                        return
                    }
                }
            }
            Gravitec._removeJeapieGID();
            Gravitec._createOnResultEvent(c.data.subscription || c.data.httpRegistered);
            Gravitec._removeWidget(["gravitec-line-widget", "gravitec-push-container", "gravitec-prompt-widget", "gravitec-line-widget-instead-prompt"]);
            b(c.data.subscription)
        }

        if (!Gravitec.messageListener) {
            window.addEventListener("message", a, false)
        }
        Gravitec.messageListener = true
    },
    _removeWidget: function (d) {
        var c;
        var f, b;
        for (c in d) {
            if (d.hasOwnProperty(c)) {
                f = d[c];
                b = document.getElementById(f);
                if (b !== null) {
                    b.parentNode.removeChild(b)
                }
            }
        }
    },
    localSubscribe: function () {
        return new Promise(function (b, a) {
            Gravitec.Notification.requestPermission(function (c) {
                if (c === "granted") {
                    return b()
                }
                return a(c)
            })
        })
    },
    _subscribe: function (a) {
        a = a || Gravitec._noop;
        if (Gravitec.gravitecMode == "chrome") {
            navigator.serviceWorker.ready.then(function (b) {
                Gravitec.localSubscribe().then(function () {
                    b.pushManager.subscribe({userVisibleOnly: true}).then(function (c) {
                        console.log(c);
                        return c
                    })["catch"](function (c) {
                        console.log("problems with: " + c)
                    }).then(function (c) {
                        a(c ? Gravitec._prepareId(c) : (c === null ? null : false))
                    })["catch"](function (c) {
                        if (!Gravitec.isNotificationPermitted()) {
                            Gravitec._log("Permission for Notifications was denied");
                            Gravitec._removeWidget(["gravitec-line-widget", "gravitec-push-container", "gravitec-prompt-widget", "gravitec-line-widget-instead-prompt"]);
                            a(false)
                        } else {
                            Gravitec._log("Unable to subscribe to push.", c);
                            a(null)
                        }
                    })
                })["catch"](function (c) {
                    Gravitec._log("Permission for Notifications was " + (c === "default" ? "closed" : "blocked"));
                    console.info("notification permission " + (c === "default" ? "closed" : "blocked"));
                    a(c === "default" ? null : false)
                })
            })["catch"](function (b) {
                console.log("problems with: " + b)
            });
            return true
        }
        a(false)
    },
    _registerNewUser: function (a, b) {
        b = b || Gravitec._noop;
        Gravitec._send(Gravitec.hostUrl + Gravitec.api.subscribe.url, Gravitec.api.subscribe.method, a, function (c) {
            if (!c.error) {
                return b(c)
            } else {
                throw new Error("Gravitec: User not subscribed", c.message)
            }
        })
    },
    _setCookie: function (c, d, f) {
        var b = new Date();
        b.setTime(b.getTime() + f * 86400000);
        var a = "; expires=" + b.toUTCString();
        document.cookie = encodeURIComponent(c) + "=" + encodeURIComponent(d) + a + "; path=/"
    },
    _checkCookie: function (b) {
        var f = b + "=";
        var c = document.cookie.split(";");
        var a;
        for (a = 0; a < c.length; a++) {
            for (var d = c[a]; " " == d.charAt(0);) {
                d = d.substring(1)
            }
            if (d.indexOf(f) == 0) {
                return d.substring(f.length, d.length)
            }
        }
        return ""
    },
    _checkBrowser: function () {
        if (document.baseURI.indexOf(Gravitec.webSiteDomain) == -1) {
            console.log("You must use this SDK only for " + Gravitec.webSiteDomain);
            return false
        }
        var a = Gravitec.detectBrowser().name.toLowerCase();
        if ("ie" == a) {
            return false
        }
        if ((document.baseURI || (window.location && window.location.href) || "").indexOf(Gravitec.webSiteDomain) == -1 && !Gravitec.isGravitecSubdomain) {
            Gravitec._log("You must use this SDK only for " + Gravitec.webSiteDomain);
            return false
        }
        if (Gravitec.checkIfSafariNotification()) {
            Gravitec.gravitecMode = "safari";
            return true
        }
        if (!Gravitec.isPushManagerSupported()) {
            Gravitec._log("Push messaging isn't supported.");
            return false
        }
        if (!Gravitec.isNotificationsSupported()) {
            Gravitec._log("Notifications aren't supported.");
            return false
        }
        if (!Gravitec.isNotificationPermitted()) {
            Gravitec._log("The user has blocked notifications.");
            return false
        }
        Gravitec.gravitecMode = "chrome";
        return true
    },
    _isIncognito: function () {
        return new Promise(function (c, b) {
            var a = window.RequestFileSystem || window.webkitRequestFileSystem;
            if (!a) {
                return b()
            }
            a(window.TEMPORARY, 100, c, b)
        })
    },
    _getScreenWidth: function () {
        return window.screen ? screen.width : 0
    },
    _getScreenHeight: function () {
        return window.screen ? screen.height : 0
    },
    isNotificationsSupported: function () {
        return "showNotification" in (ServiceWorkerRegistration && ServiceWorkerRegistration.prototype)
    },
    isNotificationPermitted: function () {
        return Gravitec.isHttp || "denied" != Notification.permission
    },
    isPushManagerSupported: function () {
        return "PushManager" in window
    },
    getCurrentTimestamp: function () {
        return Math.floor(Date.now() / 1000)
    },
    getBrowserlanguage: function () {
        return navigator.language.substring(0, 2)
    },
    checkIfSafariNotification: function () {
        return "safari" in window && "pushNotification" in window.safari
    },
    getTimezone: function () {
        return -60 * (new Date).getTimezoneOffset()
    },
    getIsPushManagerSupported: function (a) {
        a = a || Gravitec._noop;
        return a(Gravitec.isPushManagerSupported())
    },
    isMobileScreen: function () {
        var a = false;
        return function (b) {
            (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = true)
        }(navigator.userAgent || navigator.vendor || window.opera), a
    },
    detectBrowser: function () {
        var c, b = navigator.userAgent,
            a = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        return /trident/i.test(a[1]) ? (c = /\brv[ :]+(\d+)/g.exec(b) || [], {
            name: "IE",
            version: c[1] || ""
        }) : "Chrome" === a[1] && (c = b.match(/\bOPR\/(\d+)/), null != c) ? {
            name: "Opera",
            version: c[1]
        } : (a = a[2] ? [a[1], a[2]] : [navigator.appName, navigator.appVersion, "-?"], null != (c = b.match(/version\/(\d+)/i)) && a.splice(1, 1, c[1]), {
            name: a[0],
            version: a[1]
        })
    },
    endpointWorkaround: function (b) {
        if (~b.indexOf("https://android.googleapis.com/gcm/_send")) {
            var a = b.split("https://android.googleapis.com/gcm/_send/");
            return a[1]
        }
        return b
    },
    _prepareId: function (g, j) {
        j = j || {};
        if (!g) {
            return j
        }
        var d, c;
        var h = false;
        var b = g && ((("subscriptionId" in g) && g.subscriptionId) || (("endpoint" in g) && g.endpoint)) || "";
        var a = [{name: "CHROME", prefix: "https://android.googleapis.com/gcm/send/"}, {
            name: "FIREFOX",
            prefix: "https://updates.push.services.mozilla.com/"
        }];
        for (d = 0; d < a.length; d++) {
            c = a[d];
            if (~b.indexOf(a[d].prefix)) {
                j.regID = b.split(a[d].prefix)[1];
                j.browser = a[d].name;
                h = true
            }
            if (h) {
                if (j.browser === "CHROME" || j.browser === "FIREFOX") {
                    var f = (g.toJSON && g.toJSON().keys) || {};
                    j.auth = f.auth;
                    j.p256dh = f.p256dh
                }
                break
            }
        }
        j.regID = j.regID || b;
        j.browser = j.browser || (Gravitec.gravitecMode === "safari");
        return j
    },
    getBrowser: function () {
        if (Gravitec.browserDetected) {
            return Gravitec.browserDetected
        }
        if ((!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0) {
            return (Gravitec.browserDetected = "opera")
        }
        if (typeof InstallTrigger !== "undefined") {
            return (Gravitec.browserDetected = "firefox")
        }
        if (Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0) {
            return (Gravitec.browserDetected = "safari")
        }
        if (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0) {
            return (Gravitec.browserDetected = "ie")
        }
        if (!!window.StyleMedia) {
            return (Gravitec.browserDetected = "edge")
        }
        if (!!window.chrome) {
            return (Gravitec.browserDetected = "chrome")
        }
        return (Gravitec.browserDetected = "idk")
    }
};
if (tempGravitec) {
    var isInit = false, e, item;
    for (item in tempGravitec) {
        if (tempGravitec.hasOwnProperty(item)) {
            if (in_array("init", tempGravitec[item])) {
                isInit = true;
                if (item !== 0) {
                    e = tempGravitec[0];
                    tempGravitec[0] = tempGravitec[item];
                    tempGravitec[item] = e
                }
            }
        }
    }
    if (!isInit) {
        Gravitec.push(["init"])
    }
    Gravitec._processPushes(tempGravitec)
}
;