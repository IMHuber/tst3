package com.pushgroup.core.service.subscription;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.pushgroup.core.domain.BrowserName;
import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.domain.Subscription;
import com.pushgroup.core.mapper.SubscriptionMapper;
import com.pushgroup.core.util.Helper;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.security.Security;
import java.util.HashMap;
import java.util.List;

import static com.pushgroup.core.service.subscription.Sender.PushServiceType.KEYS_CHROME;
import static com.pushgroup.core.service.subscription.Sender.PushServiceType.KEYS_FIREFOX;


@Service
public class Sender {
    private static final Logger LOGGER = LoggerFactory.getLogger(Sender.class);
    
    private static final String vapidPublicKey = "BFhHkNpDJPHyCzPpnUNufgdPaGEA7bFQ-eB4LVfSTzeDzoS-zN4pROy4y0KFelz8A-1tXmGLJevgv14ORdnYcRg";
    private static final String vapidPrivateKey = "rJ6JSLkWRE0UabT3n18QmUQFXYrN86NWRYpr2bTkeGg";

    @Autowired
    private SubscriptionMapper subscribeMapper;


    public Sender() {
        // Add BouncyCastle as an algorithm provider
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }



    public HashMap<Integer, Integer> send(List<Subscription> subscriptions, Payload payload) {
        LOGGER.info("Start to prepare sending notification");
        LOGGER.info("Number of subscriptions to send is " + subscriptions.size());

        PushService pushService = null;
        PushServiceType currentPushServiceType = null;
        HashMap<Integer, Integer> sendingRes = new HashMap<>();
        
        for(Subscription subscription : subscriptions) {
            PushServiceType subPushServiceType = definePushServiceTypeBySubscription(subscription);
            if(pushService == null || (currentPushServiceType != null && !currentPushServiceType.equals(subPushServiceType))) {
                currentPushServiceType = subPushServiceType;
                pushService = initPushService(currentPushServiceType);
            }

            try {
                LOGGER.info("Prepare notification for Subscription[{}] and start to send", subscription.getId());

                Notification notification = new Notification(subscription.getEndpoint(), subscription.getP256dh(), subscription.getAuth(), payloadToByteArray(payload));
                HttpResponse httpResponse = pushService.send(notification);
                int status = httpResponse.getStatusLine().getStatusCode();

                sendingRes.put(status, sendingRes.get(status) != null? sendingRes.get(status) + 1 : 1);
                LOGGER.info("Finish to send to Subscription[{}]. Status code = {}", subscription.getId(), status);

                if(status == HttpStatus.NOT_FOUND.value() || status == HttpStatus.GONE.value()) {
                    LOGGER.error("Status code for Subscription[{}] is {}. Start to delete subscription", subscription, status);
                    subscribeMapper.updateActiveSubscriptionById(subscription.getId(), false);
                    LOGGER.info("Delete Subscription[{}] successfully.", subscription.getId());
                }
                //System.out.println(IOUtils.toString(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
            } catch (Exception e) {
                sendingRes.put(HttpStatus.INTERNAL_SERVER_ERROR.value(), sendingRes.get(HttpStatus.INTERNAL_SERVER_ERROR.value()) != null?
                        sendingRes.get(HttpStatus.INTERNAL_SERVER_ERROR.value()) + 1 : 1);
                LOGGER.info("Failed to send to Subscription[{}]. Error: {}", subscription, e);
            }
        }

        LOGGER.info("Finish to send notifications successfully");
        return sendingRes;
    }

    private PushService initPushService(PushServiceType pushServiceType) {
        LOGGER.info("Start to init PushService for {}", pushServiceType);
        PushService pushService = new PushService();
        pushService.setSubject("mailto:emailaddresson@gmail.com");

        try {
            if(pushServiceType.equals(KEYS_CHROME) || pushServiceType.equals(KEYS_FIREFOX)) {
                pushService.setPublicKey(Utils.loadPublicKey(vapidPublicKey));
                pushService.setPrivateKey(Utils.loadPrivateKey(vapidPrivateKey));
            } else {
                LOGGER.error("Failed to init PushService for {}. Unsupported PushServiceType.", pushServiceType);
            }
            LOGGER.info("Finish to init PushService for {} successfully.", pushServiceType);
        } catch (Exception e) {
            LOGGER.error("Failed to init PushService for {}. Error: ", pushServiceType, e);
        }
        return pushService;
    }

    private PushServiceType definePushServiceTypeBySubscription(Subscription subscription) {
        if(subscription.getEndpoint().contains(KEYS_CHROME.getBrowserSupport().getEndpointSign()) ||
                (subscription.getBrowserName().contains(KEYS_CHROME.getBrowserSupport().getBrowserName().name()))) {
            return KEYS_CHROME;
        } else if (subscription.getEndpoint().contains(KEYS_FIREFOX.getBrowserSupport().getEndpointSign()) ||
                (subscription.getBrowserName().contains(KEYS_FIREFOX.getBrowserSupport().getBrowserName().name()))) {
            return KEYS_FIREFOX;
        }
        return null;
    }

    private byte[] payloadToByteArray(Payload payload) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("title", payload.getTitle());
        jsonObject.addProperty("body", payload.getBody());
        jsonObject.add("data", buildDataJson(payload));
        jsonObject.addProperty("iconUrl", payload.getIconUrl());
        jsonObject.addProperty("imageUrl", payload.getImageUrl());
        jsonObject.addProperty("badgeUrl", payload.getBadgeUrl());
        jsonObject.addProperty("soundUrl", payload.getSoundUrl());
        jsonObject.addProperty("vibrate", payload.getVibrateAsJson());

        if(!CollectionUtils.isEmpty(payload.getActions())) {
            JsonArray actArr = new JsonArray();
            for(Payload.Action action : payload.getActions()) {
                JsonObject actJson = new JsonObject();
                actJson.addProperty("action", action.getAction());
                actJson.addProperty("title", action.getTitle());
                actJson.addProperty("icon", action.getIconUrl());
                actArr.add(actJson);
            }
            jsonObject.add("actions", actArr);
        }
        jsonObject.addProperty("dir", payload.getDir());
        jsonObject.addProperty("tag", payload.getTag());
        jsonObject.addProperty("requireInteraction", payload.getRequireInteraction());
        jsonObject.addProperty("renotify", payload.getRenotify());
        jsonObject.addProperty("silent", payload.getSilent());
        jsonObject.addProperty("timestamp", payload.getTimestamp() != null? payload.getTimestamp().toString() : null);

        return jsonObject.toString().getBytes();
    }

    private JsonObject buildDataJson(Payload payload) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("offerUrl", payload.getOfferUrl());
        jsonObject.addProperty("formData", payload.getData());
        jsonObject.addProperty("hash", payload.getHash());
        jsonObject.addProperty("apiUrl", Helper.API_URL);

        if(!CollectionUtils.isEmpty(payload.getActions())) {
            JsonArray actUrls = new JsonArray();
            for(Payload.Action action : payload.getActions()) {
                JsonObject actUrl = new JsonObject();
                actUrl.addProperty("action", action.getAction());
                actUrl.addProperty("url", action.getUrl());
                actUrls.add(actUrl);
            }
            jsonObject.add("actionsUrls", actUrls);
        }
        return jsonObject;
    }


    public enum PushServiceType {
        KEYS_CHROME(new PushServiceBrowserSupport(BrowserName.CHROME, "52", "700", "fcm.googleapis.com")),
        KEYS_FIREFOX(new PushServiceBrowserSupport(BrowserName.FIREFOX, "44", "650", "updates.push.services.mozilla.com")),
        GSM_CHROME(new PushServiceBrowserSupport(BrowserName.CHROME, "44", "51", "android.googleapis.com"));

        private PushServiceBrowserSupport browserSupport;

        PushServiceType(PushServiceBrowserSupport browserSupport) {
            this.browserSupport = browserSupport;
        }

        public PushServiceBrowserSupport getBrowserSupport() {
            return browserSupport;
        }
    }

    private static class PushServiceBrowserSupport {
        private BrowserName browserName;
        private String firstVersion;
        private String lastVersion;
        private String endpointSign;

        public PushServiceBrowserSupport(BrowserName browserName, String firstVersion, String lastVersion, String endpointSign) {
            this.browserName = browserName;
            this.firstVersion = firstVersion;
            this.lastVersion = lastVersion;
            this.endpointSign = endpointSign;
        }

        public BrowserName getBrowserName() {
            return browserName;
        }

        public void setBrowserName(BrowserName browserName) {
            this.browserName = browserName;
        }

        public String getFirstVersion() {
            return firstVersion;
        }

        public void setFirstVersion(String firstVersion) {
            this.firstVersion = firstVersion;
        }

        public String getLastVersion() {
            return lastVersion;
        }

        public void setLastVersion(String lastVersion) {
            this.lastVersion = lastVersion;
        }

        public String getEndpointSign() {
            return endpointSign;
        }

        public void setEndpointSign(String endpointSign) {
            this.endpointSign = endpointSign;
        }
    }
}
