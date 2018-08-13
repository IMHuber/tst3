package com.pushgroup.core.service;


import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.domain.Subscription;
import com.pushgroup.core.dto.FiltersDto;
import com.pushgroup.core.filtering.Condition;


import java.util.List;
import java.util.Map;
import java.util.Set;

public interface SubscriptionService {
    void subscribe(Subscription subscription);
    void send(List<Condition> conditions, Payload payload);
    List<Condition> getFilterConditions();
    Set<Subscription> getSubscriptions(List<Condition> conditions, int limit, int offset);
    Long getCount(List<Condition> conditions);
}
