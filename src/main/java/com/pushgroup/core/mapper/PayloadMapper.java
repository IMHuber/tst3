package com.pushgroup.core.mapper;

import com.pushgroup.core.domain.Payload;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface PayloadMapper {
    void insertPayload(Payload payload);
    void updatePayloadStatByHash(@Param("hash") Long hash, @Param("isClick") Boolean isClick, @Param("isView") Boolean isView, @Param("isPush") Boolean isPush);

    List<Payload> getLastPayloadsByApiKeyAndLimitOffset(@Param("apiKey") String apiKey, @Param("offset") int offset, @Param("limit") int limit);
}
