package com.pushgroup.core.service.subscription;


import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.domain.Subscription;
import com.pushgroup.core.filtering.Condition;


import java.util.HashMap;
import java.util.List;
import java.util.Set;

public interface SubscriptionService {
    void subscribe(Subscription subscription);
    HashMap<Integer, Integer> send(List<Subscription> subscriptions, Payload payload);
    List<Condition> getFilterConditions();
    List<Subscription> getSubscriptions(List<Condition> conditions);
    List<Subscription> getSubscriptions(List<Condition> conditions, int limit, int offset);
    Long getCount(List<Condition> conditions);

    void updatePayloadStat(Long hash, Boolean isClick, Boolean isView, Boolean isPush);
}
