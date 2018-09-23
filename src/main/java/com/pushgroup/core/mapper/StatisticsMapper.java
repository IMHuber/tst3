package com.pushgroup.core.mapper;

import com.pushgroup.core.domain.Subscription;
import com.pushgroup.core.domain.statistics.DataGrowth;
import com.pushgroup.core.domain.statistics.KeyValue;
import com.pushgroup.core.domain.statistics.PayloadOverall;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface StatisticsMapper {
    List<DataGrowth> getSubscriptionsGrowth(@Param("apiKey") String apiKey);
    List<DataGrowth> getViewsGrowth(@Param("apiKey") String apiKey);
    List<DataGrowth> getClicksGrowth(@Param("apiKey") String apiKey);

    List<KeyValue> getPlatformStats(@Param("apiKey") String apiKey);
    List<KeyValue> getDeviceStats(@Param("apiKey") String apiKey);
    List<KeyValue> getBrowserStats(@Param("apiKey") String apiKey);

    PayloadOverall getPayloadOverall(@Param("apiKey") String apiKey);
}
