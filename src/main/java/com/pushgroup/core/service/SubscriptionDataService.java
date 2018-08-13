package com.pushgroup.core.service;



import com.google.gson.JsonObject;
import com.pushgroup.core.domain.*;
import com.pushgroup.core.dto.FiltersDto;
import com.pushgroup.core.filtering.Condition;
import com.pushgroup.core.filtering.FilterConditionBuilder;
import com.pushgroup.core.mapper.SubscriptionMapper;
import com.pushgroup.core.util.Helper;
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
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.Security;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class SubscriptionDataService implements SubscriptionService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SubscriptionDataService.class);

    @Autowired
    private SubscriptionMapper subscribeMapper;
    @Autowired
    private FilterConditionBuilder filterConditionBuilder;
    @Autowired
    private Sender sender;


    public SubscriptionDataService() {
        // Add BouncyCastle as an algorithm provider
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @Override
    public void subscribe(Subscription subscription) {
        LOGGER.info("Start to subscribe.");
        insertSubscription(subscription);
        insertSubscriptionCategory(subscription);
        LOGGER.info("Subscribed successfully.");
    }

    private void insertSubscription(Subscription subscription) {
        LOGGER.info("Start to insert Subscription. ", subscription);
        if(StringUtils.isEmpty(subscription.getCountryCode())) {
            try{
                IpLocation ipLocation = subscribeMapper.getIpLocationByIp(subscription.getIp());
                if(ipLocation != null) {
                    subscription.setCountryCode(ipLocation.getCountryCode());
                    subscription.setCountryName(ipLocation.getCountryName());
                    subscription.setCityName(ipLocation.getCityName());
                    subscription.setRegionName(ipLocation.getRegionName());
                    subscription.setIp2locationId(ipLocation.getId());
                }  else {
                    LOGGER.error("Can't find GEO Info for IP = {}", subscription.getIp());
                }
            } catch (Exception e) {
                LOGGER.error("Can't getIpLocationByIp. Error: " + e);
            }
        }
        subscribeMapper.insertSubscription(subscription);
        LOGGER.info("Inserted Subscription successfully.");
    }

    private void insertSubscriptionCategory(Subscription subscription) {
        LOGGER.info("Start to insert SubscriptionCategory.");
        if(!StringUtils.isEmpty(subscription.getCategoryNames())) {
            for(String catName : subscription.getCategoryNames()) {
                Category category = subscribeMapper.getCategoryByName(catName);
                if(category != null)
                    subscribeMapper.insertSubCatRef(subscription.getId(), category.getId());
                else {
                    category = new Category(catName, null);
                    subscribeMapper.insertCategory(category);
                    subscribeMapper.insertSubCatRef(subscription.getId(), category.getId());
                }
            }
        }
        LOGGER.info("Inserted SubscriptionCategory successfully.");
    }

    @Override
    public void send(List<Condition> conditions, Payload payload) {
        LOGGER.info("Start SubscriptionDataService.send for Payload[{}]", payload);
        sender.send(conditions, payloadToByteArray(payload));
        LOGGER.info("Finish SubscriptionDataService.send");
    }

    @Override
    public List<Condition> getFilterConditions() {
        return filterConditionBuilder.buildInitConditionList();
    }

    @Override
    public Set<Subscription> getSubscriptions(List<Condition> conditions, int limit, int offset) {
        LOGGER.info("Start to get subscription");
        String condition = Helper.buildWhereClause(conditions);
        return subscribeMapper.getSubscriptionsByCondition(condition);
    }

    @Override
    public Long getCount(List<Condition> conditions) {
        LOGGER.info("Start to get subscription");
        String condition = Helper.buildWhereClause(conditions);
        return subscribeMapper.getCountByCondition(condition);
    }

    private byte[] payloadToByteArray(Payload payload) {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("title", "Hello");
        jsonObject.addProperty("message", "World");

        return jsonObject.toString().getBytes();
    }

}
