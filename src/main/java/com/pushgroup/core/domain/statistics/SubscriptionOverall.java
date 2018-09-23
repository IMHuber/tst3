package com.pushgroup.core.domain.statistics;

import java.util.HashMap;
import java.util.List;

public class SubscriptionOverall {
    private Long subscriptionsTotal;
    private Long activeSubscriptionsTotal;
    private HashMap<DataName, List<DataGrowth>> dataGrowthMap;
    private List<GroupedData> groupedData;


    public Long getSubscriptionsTotal() {
        return subscriptionsTotal;
    }

    public void setSubscriptionsTotal(Long subscriptionsTotal) {
        this.subscriptionsTotal = subscriptionsTotal;
    }

    public Long getActiveSubscriptionsTotal() {
        return activeSubscriptionsTotal;
    }

    public void setActiveSubscriptionsTotal(Long activeSubscriptionsTotal) {
        this.activeSubscriptionsTotal = activeSubscriptionsTotal;
    }

    public HashMap<DataName, List<DataGrowth>> getDataGrowthMap() {
        return dataGrowthMap;
    }

    public void setDataGrowthMap(HashMap<DataName, List<DataGrowth>> dataGrowthMap) {
        this.dataGrowthMap = dataGrowthMap;
    }

    public List<GroupedData> getGroupedData() {
        return groupedData;
    }

    public void setGroupedData(List<GroupedData> groupedData) {
        this.groupedData = groupedData;
    }

}
