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
    void updateActiveSubscriptionById(@Param("subId") Long subId, @Param("active") Boolean active);
    void insertBrowser(Browser browser);
    void insertCategory(Category category);
    void insertSubCatRef(@Param("subId") Long subId, @Param("catId") Long catId);
    void deleteSubCatRef(@Param("subId") Long subId);

    List<Subscription> getAllSubscriptions();
    List<Subscription> getSubscriptionsByConditionAndActive(@Param("condition") String condition, @Param("isActive") Boolean isActive);
    List<Subscription> getSubscriptionsByConditionAndLimitAndOffsetAndActive(@Param("condition") String condition, @Param("limit") int limit, @Param("offset") int offset,
                                                                             @Param("isActive") Boolean isActive);

    List<Browser> getBrowsersByNameAndMajorVersion(@Param("name") String name, @Param("majorVersion") String majorVersion);
    List<Category> getAllCategories();
    Category getCategoryByName(@Param("name") String name);

    Long getSubCountByConditionAndActive(@Param("condition") String condition, @Param("isActive") Boolean isActive);
    List<String> getAllLandingLanguages();
    List<String> getAllBrowsersNames();
    List<String> getAllMajorVersionsByBrowserName(@Param("name") String name);
    List<String> getAllBrowserLanguages();
    List<String> getAllOsNames();
    List<String> getAllVersionsByOsName(@Param("name") String name);
    List<String> getAllCountyCodes();
    List<String> getAllCountryNames();
    List<String> getAllCityNames();
    List<String> getAllTraffTypes();

    IpLocation getIpLocationByIp(@Param("ip") String ip);
}
