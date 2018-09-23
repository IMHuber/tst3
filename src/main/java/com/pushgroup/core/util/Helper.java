package com.pushgroup.core.util;

import com.pushgroup.core.domain.Payload;
import com.pushgroup.core.dto.FiltersDto;
import com.pushgroup.core.filtering.Condition;
import com.pushgroup.security.user.PushUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

public final class Helper {
    public final static int BCRYPT_SALT_LENGTH = 11;
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(Helper.BCRYPT_SALT_LENGTH);
    
    public final static String ANONYMOUS_NAME = "anonymous_name";
    public final static String REQUEST_USERNAME_ATTR_NAME = "username";
    public final static String REQUEST_PASSWORD_ATTR_NAME = "password";
    public final static String CLICK_ID_ATTR_NAME = "click_id";
    public static final String CLICK_ID_GET_URL = "https://yandex.ru/?id=%s";
    public final static String API_URL = "/api";
    //public final static String API_URL = "tesorin.com/evif-hotnews/api";
    public final static String API_SECRET = "VeEd2iboNeXUXMdMj3srRecROZ1bqozC99HnYwewS";
    
    private static final Logger LOGGER = LoggerFactory.getLogger(Helper.class);


    public static String buildWhereClause(List<Condition> conditions) {
        LOGGER.info("Start to build whereClause");
        StringBuilder sb = new StringBuilder();
        int condIdx = 0;

        for(Condition condition : conditions) {
            if(CollectionUtils.isEmpty(condition.getSelectedValues()) || (condition.getSelectedValues().size() == 1 && StringUtils.isEmpty(condition.getSelectedValues().get(0))))
                continue;
            if(condIdx > 0)
                sb.append(" and ");

            sb.append("(");
            int valIdx = 0;
            for(String value : condition.getSelectedValues()) {
                if(valIdx > 0)
                    sb.append(" or ");

                sb.append("(");
                sb.append(condition.getQueryFieldName() + condition.getOperator() + "'" + value + "'");

                if(condition.getRelatedChildrenCondition() != null) {
                    for(Condition childCondition : condition.getRelatedChildrenCondition()) {
                        if(CollectionUtils.isEmpty(childCondition.getSelectedValues()) ||
                                (childCondition.getSelectedValues().size() == 1 && StringUtils.isEmpty(childCondition.getSelectedValues().get(0))) ||
                                !childCondition.getRelatedParentValue().equals(value))
                            continue;

                        sb.append(" and " + childCondition.getQueryFieldName() + " in(");
                        int childValIdx = 0;
                        for(String childValue : childCondition.getSelectedValues()) {
                            if(childValIdx > 0)
                                sb.append(",");
                            sb.append("'" + childValue + "'");
                            childValIdx++;
                        }
                        sb.append(")");
                    }
                }
                sb.append(")");
                valIdx++;
            }
            sb.append(")");
            condIdx++;
        }

        LOGGER.info("Built whereClause successfully res = {}", sb.toString());
        return sb.toString();
    }


    public static String generateCurrentUserApiKey() {
        String username = ((PushUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return passwordEncoder.encode(username + ":" + API_SECRET);
    }

    public static String getUserApiKey() {
         return ((PushUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getApiKey();
    }
}
