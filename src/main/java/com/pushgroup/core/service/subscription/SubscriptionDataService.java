package com.pushgroup.core.service.subscription;



import com.pushgroup.core.domain.*;
import com.pushgroup.core.filtering.Condition;
import com.pushgroup.core.filtering.FilterConditionBuilder;
import com.pushgroup.core.mapper.PayloadMapper;
import com.pushgroup.core.mapper.SubscriptionMapper;
import com.pushgroup.core.mapper.UserSubscriptionMapper;
import com.pushgroup.core.util.Helper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;


@Service
public class SubscriptionDataService implements SubscriptionService {
    private static final Logger LOGGER = LoggerFactory.getLogger(SubscriptionDataService.class);

    @Autowired
    private SubscriptionMapper subscriptionMapper;
    @Autowired
    private UserSubscriptionMapper userSubscriptionMapper;
    @Autowired
    private PayloadMapper payloadMapper;
    @Autowired
    private FilterConditionBuilder filterConditionBuilder;
    @Autowired
    private Sender sender;


    @Override
    public void subscribe(Subscription subscription) {
        LOGGER.info("Start to subscribe.");
        insertSubscription(subscription);
        //sendClickId(subscription);
        LOGGER.info("Subscribed successfully.");
    }

    private void insertSubscription(Subscription subscription) {
        LOGGER.info("Start to insert Subscription[{}]", subscription);
        setGeo(subscription);
        subscriptionMapper.insertSubscription(subscription);
        LOGGER.info("Inserted Subscription successfully.");
    }

    private void setGeo(Subscription subscription) {
        if(StringUtils.isEmpty(subscription.getCountryCode())) {
            try{
                IpLocation ipLocation = subscriptionMapper.getIpLocationByIp(subscription.getIp());
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
    }

    private void sendClickId(Subscription subscription) {
        if(StringUtils.isEmpty(subscription.getSourceUrl())) {
            LOGGER.error("Subscription[{}] does not have sourceUrl", subscription.getId());
        }
        Map<String, String> params = getQueryMap(subscription.getSourceUrl());
        String clickId = params.get(Helper.CLICK_ID_ATTR_NAME.toLowerCase());

        if(!StringUtils.isEmpty(clickId)) {
            String url = String.format(Helper.CLICK_ID_GET_URL, clickId);
            try {
                URL obj = new URL(url);
                HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                con.setRequestMethod("GET");
                int responseCode = con.getResponseCode();
                LOGGER.info("Status code for sending click_id[{}] of Subscription[{}] is {}", clickId, subscription.getId(), responseCode);
            } catch (Exception e) {
                 LOGGER.error("Failed to send clickId of Subscription[{}]. Error: {}", subscription.getId(), e);
            }
        } else {
            LOGGER.error("Subscription[{}] does not have click_id param", subscription.getId());
        }
    }

    public static Map<String, String> getQueryMap(String url) {
        Map<String, String> map = new HashMap<>();
        String[] urlSplit = url.split("\\?");
        if(urlSplit.length > 1) {
            String[] params = urlSplit[1].split("&");
            for (String param : params) {
                String name = param.split("=")[0];
                String value = param.split("=")[1];
                map.put(name != null? name.toLowerCase() : name, value);
            }
        }
        return map;
    }

    @Override
    public HashMap<Integer, Integer> send(List<Subscription> subscriptions, Payload payload) {
        LOGGER.info("Start SubscriptionDataService.send for Payload[{}]", payload);

        insertPayload(payload);
        HashMap<Integer, Integer> sendingRes = sender.send(subscriptions, payload);
        updatePayloadStat(payload.getHash(), false, false, true);

        LOGGER.info("Finish SubscriptionDataService.send");
        return sendingRes;
    }

    private void insertPayload(Payload payload) {
        LOGGER.info("Start to insert Payload[{}]", payload);
        try {
            payload.setPushedTotal(payload.getPushedTotal() != null? payload.getPushedTotal() + 1 : 1);
            payload.setApiKey(Helper.getUserApiKey());
            payload.setHash(StringUtils.isEmpty(payload.getHash())? payload.hashCode() : payload.getHash());
            payloadMapper.insertPayload(payload);
            LOGGER.info("Finish inserting Payload successfully.");
        } catch (Exception e) {
            LOGGER.error("Failed to insert Payload. Error: ", e);
        }
    }

    @Override
    public List<Condition> getFilterConditions() {
        return filterConditionBuilder.buildInitConditionList();
    }

    @Override
    public List<Subscription> getSubscriptions(List<Condition> conditions) {
        LOGGER.info("Start to get getSubscriptions");
        String condition = Helper.buildWhereClause(conditions);
        return userSubscriptionMapper.getSubscriptionsByConditionAndActive(condition, true, Helper.getUserApiKey());
    }

    @Override
    public List<Subscription> getSubscriptions(List<Condition> conditions, int limit, int offset) {
        LOGGER.info("Start to get getSubscriptionsByConditionAndLimitAndOffset");
        String condition = Helper.buildWhereClause(conditions);
        return userSubscriptionMapper.getSubscriptionsByConditionAndLimitAndOffsetAndActive(condition, limit, offset, true, Helper.getUserApiKey());
    }

    @Override
    public Long getCount(List<Condition> conditions) {
        LOGGER.info("Start to get subscription");
        String condition = Helper.buildWhereClause(conditions);
        return userSubscriptionMapper.getSubCountByConditionAndActive(condition, true, Helper.getUserApiKey());
    }

    @Override
    public void updatePayloadStat(Long hash, Boolean isClick, Boolean isView, Boolean isPush) {
        LOGGER.info("Start to update Payload[{}]", hash);
        payloadMapper.updatePayloadStatByHash(hash, isClick, isView, isPush);
        LOGGER.info("Finish to update Payload successfully.");
    }

}
