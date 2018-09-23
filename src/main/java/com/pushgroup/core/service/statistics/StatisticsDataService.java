package com.pushgroup.core.service.statistics;

import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.domain.statistics.*;
import com.pushgroup.core.mapper.PayloadMapper;
import com.pushgroup.core.mapper.StatisticsMapper;
import com.pushgroup.core.mapper.UserSubscriptionMapper;
import com.pushgroup.core.util.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


@Service
public class StatisticsDataService implements StatisticsService {

    @Autowired
    private UserSubscriptionMapper userSubscriptionMapper;
    @Autowired
    private StatisticsMapper statisticsMapper;
    @Autowired
    private PayloadMapper payloadMapper;

    private static final int initPayloadOffset = 0;
    private static final int initPayloadLimit = 5;
    

    @Override
    public Statistics getCurrentStatistics() {
        String apiKey = Helper.getUserApiKey();
        SubscriptionOverall subscriptionOverall = new SubscriptionOverall();
        Long activeSub = userSubscriptionMapper.getSubCountByConditionAndActive(null, true, apiKey);
        Long inactiveSub = userSubscriptionMapper.getSubCountByConditionAndActive(null, false, apiKey);

        HashMap<DataName, List<DataGrowth>> dataGrowthMap = new HashMap<>();
        dataGrowthMap.put(DataName.SUBSCRIPTION, statisticsMapper.getSubscriptionsGrowth(apiKey));
        dataGrowthMap.put(DataName.VIEW, statisticsMapper.getViewsGrowth(apiKey));
        dataGrowthMap.put(DataName.CLICK, statisticsMapper.getClicksGrowth(apiKey));

        List<GroupedData> groupedData = new ArrayList<>();
        groupedData.add(new GroupedData(GroupedDataName.PLATFORM, statisticsMapper.getPlatformStats(apiKey)));
        groupedData.add(new GroupedData(GroupedDataName.DEVICE, statisticsMapper.getDeviceStats(apiKey)));
        groupedData.add(new GroupedData(GroupedDataName.BROWSER, statisticsMapper.getBrowserStats(apiKey)));

        subscriptionOverall.setActiveSubscriptionsTotal(activeSub);
        subscriptionOverall.setSubscriptionsTotal(activeSub + inactiveSub);
        subscriptionOverall.setDataGrowthMap(dataGrowthMap);
        subscriptionOverall.setGroupedData(groupedData);

        PayloadOverall payloadOverall = statisticsMapper.getPayloadOverall(apiKey);
        List<Payload> lastPayloads = payloadMapper.getLastPayloadsByApiKeyAndLimitOffset(apiKey, initPayloadOffset, initPayloadLimit);

        Statistics statistics = new Statistics(null, lastPayloads, subscriptionOverall, payloadOverall);
        return statistics;
    }
}
