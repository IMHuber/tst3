

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push had this data.text:' + event.data.text());

    var response = JSON.parse(event.data.text());
    var title = response.title;
    var data = response.data;

    var options = {
        body: response.body,
        data: data,
        icon: response.iconUrl,
        image: response.imageUrl,
        sound: response.soundUrl,
        actions: response.actions,
        renotify: response.renotify,
        requireInteraction: response.requireInteraction,
        tag: response.tag,

        //mobile only
        badge: response.badgeUrl,
        vibrate: response.vibrate
    };

    updatePayloadStat(data.apiUrl, data.hash, false, true);
    event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    console.log('event.notification.data:' + event.notification.data);
    console.log('event.notification.data.offerUrl:' + event.notification.data.offerUrl);

    var data = event.notification.data;

    updatePayloadStat(data.apiUrl, data.hash, true, false);
    event.notification.close();

    if (!event.action) {
        event.waitUntil(clients.openWindow(data.offerUrl));
    } else {
        var action = data.actionsUrls.find(function(node) {
            return node.action === event.action;
        });
        console.log('action.url:' + action.url);
        if(action.url != null)
            event.waitUntil(clients.openWindow(action.url));
        else
            event.waitUntil(clients.openWindow(data.offerUrl));

    }
});

function updatePayloadStat(apiUrl, hash, isClick, isView) {

    fetch(apiUrl + '/statistics/payload', {
        method: 'put',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            hash: hash,
            isClick: isClick,
            isView: isView
        })
    }).then(function(response) {
        console.log(response);
    });
}