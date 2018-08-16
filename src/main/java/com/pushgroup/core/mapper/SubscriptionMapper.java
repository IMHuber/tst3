package com.pushgroup.core.mapper;

import com.pushgroup.core.domain.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;


@Mapper
public interface SubscriptionMapper {
    void insertSubscription(Subscription subscription);
    void deleteSubscription(@Param("subId") Long subId);
    void insertBrowser(Browser browser);
    void insertCategory(Category category);
    void insertSubCatRef(@Param("subId") Long subId, @Param("catId") Long catId);
    void deleteSubCatRef(@Param("subId") Long subId);
    void insertPayload(Payload payload);

    List<Browser> getBrowsersByNameAndMajorVersion(@Param("name") String name, @Param("majorVersion") String majorVersion);
    Set<Subscription> getAllSubscriptions();
    Set<Subscription> getSubscriptionsByCondition(@Param("condition") String condition);
    Long getCountByCondition(@Param("condition") String condition);
    List<Category> getAllCategories();
    Category getCategoryByName(@Param("name") String name);

    List<String> getAllLandingLanguages();
    List<String> getAllBrowsersNames();
    List<String> getAllMajorVersionsByBrowserName(@Param("name") String name);
    List<String> getAllCountyCodes();
    List<String> getAllCountryNames();
    List<String> getAllCityNames();

    IpLocation getIpLocationByIp(@Param("ip") String ip);
}
