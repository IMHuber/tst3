package com.pushgroup.core.mapper;

import com.pushgroup.core.domain.*;
import com.pushgroup.core.domain.statistics.DataGrowth;
import com.pushgroup.core.domain.statistics.GroupedData;
import com.pushgroup.core.domain.statistics.KeyValue;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;


@Mapper
public interface UserSubscriptionMapper {
    List<Subscription> getAllSubscriptions(@Param("apiKey") String apiKey);

    List<Subscription> getSubscriptionsByConditionAndActive(@Param("condition") String condition, @Param("isActive") Boolean isActive, @Param("apiKey") String apiKey);
    List<Subscription> getSubscriptionsByConditionAndLimitAndOffsetAndActive(@Param("condition") String condition, @Param("limit") int limit, @Param("offset") int offset,
                                                                             @Param("isActive") Boolean isActive, @Param("apiKey") String apiKey);

    Long getSubCountByConditionAndActive(@Param("condition") String condition, @Param("isActive") Boolean isActive, @Param("apiKey") String apiKey);
    List<String> getAllLandingLanguages(@Param("apiKey") String apiKey);
    List<String> getAllBrowsersNames(@Param("apiKey") String apiKey);
    List<String> getAllMajorVersionsByBrowserName(@Param("name") String name, @Param("apiKey") String apiKey);
    List<String> getAllBrowserLanguages(@Param("apiKey") String apiKey);
    List<String> getAllOsNames(@Param("apiKey") String apiKey);
    List<String> getAllVersionsByOsName(@Param("name") String name, @Param("apiKey") String apiKey);
    List<String> getAllCountyCodes(@Param("apiKey") String apiKey);
    List<String> getAllCountryNames(@Param("apiKey") String apiKey);
    List<String> getAllCityNames(@Param("apiKey") String apiKey);
    List<String> getAllTraffTypes(@Param("apiKey") String apiKey);
}
