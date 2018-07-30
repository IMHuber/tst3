package com.pushgroup.core.service;



import com.google.gson.JsonObject;
import com.pushgroup.core.domain.Subscription;
import com.pushgroup.core.mapper.SubscribeMapper;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Security;


@Service
public class SubscribeDataService implements SubscribeService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SubscribeDataService.class);
    private static final String vapidPublicKey = "BFhHkNpDJPHyCzPpnUNufgdPaGEA7bFQ-eB4LVfSTzeDzoS-zN4pROy4y0KFelz8A-1tXmGLJevgv14ORdnYcRg";
    private static final String vapidPrivateKey = "rJ6JSLkWRE0UabT3n18QmUQFXYrN86NWRYpr2bTkeGg";

    public SubscribeDataService() {
        // Add BouncyCastle as an algorithm provider
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @Autowired
    private SubscribeMapper subscribeMapper;

    public void subscribe(Subscription subscription) {
        subscribeMapper.subscribe(subscription);
    }

    public void send() {
        try {
            PushService pushService = new PushService();
            pushService.setSubject("mailto:emailaddresson@gmail.com");
            pushService.setPublicKey(Utils.loadPublicKey(vapidPublicKey));
            pushService.setPrivateKey(Utils.loadPrivateKey(vapidPrivateKey));

            for(Subscription subscription : subscribeMapper.getAll()) {
                String endpoint = subscription.getEndpoint();
                String userPublicKey = subscription.getP256dh();
                String userAuth = subscription.getAuth();

                Notification notification = new Notification(endpoint, userPublicKey, userAuth, getPayload());
                HttpResponse httpResponse = pushService.send(notification);

                System.out.println(httpResponse.getStatusLine().getStatusCode());
                System.out.println(IOUtils.toString(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
            }
        } catch (Exception e) {
            LOGGER.error("Sending message failed. Error: " + e);
        }
    }

    private byte[] getPayload() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("title", "Hello");
        jsonObject.addProperty("message", "World");

        return jsonObject.toString().getBytes();
    }
}
