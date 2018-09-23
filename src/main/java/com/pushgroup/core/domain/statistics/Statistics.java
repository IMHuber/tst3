package com.pushgroup.core.domain.statistics;

import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.domain.Subscription;
import java.util.List;



public class Statistics {
    private List<Subscription> activeSubscriptions;
    private List<Payload> payloads;
    private SubscriptionOverall subscriptionOverall;
    private PayloadOverall payloadOverall;

    public Statistics(List<Subscription> activeSubscriptions, List<Payload> payloads, SubscriptionOverall subscriptionOverall, PayloadOverall payloadOverall) {
        this.activeSubscriptions = activeSubscriptions;
        this.payloads = payloads;
        this.subscriptionOverall = subscriptionOverall;
        this.payloadOverall = payloadOverall;
    }

    public List<Subscription> getActiveSubscriptions() {
        return activeSubscriptions;
    }

    public void setActiveSubscriptions(List<Subscription> activeSubscriptions) {
        this.activeSubscriptions = activeSubscriptions;
    }

    public List<Payload> getPayloads() {
        return payloads;
    }

    public void setPayloads(List<Payload> payloads) {
        this.payloads = payloads;
    }

    public PayloadOverall getPayloadOverall() {
        return payloadOverall;
    }

    public void setPayloadOverall(PayloadOverall payloadOverall) {
        this.payloadOverall = payloadOverall;
    }

    public SubscriptionOverall getSubscriptionOverall() {
        return subscriptionOverall;
    }

    public void setSubscriptionOverall(SubscriptionOverall subscriptionOverall) {
        this.subscriptionOverall = subscriptionOverall;
    }

}
