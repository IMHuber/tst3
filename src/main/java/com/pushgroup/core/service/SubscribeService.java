package com.pushgroup.core.service;


import com.pushgroup.core.domain.Subscription;

public interface SubscribeService {
    void subscribe(Subscription subscription);
    void send();
}
