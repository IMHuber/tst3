package com.pushgroup.core.mapper;

import com.pushgroup.security.user.PushUserDetails;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

@Mapper
public interface AuthMapper {
    PushUserDetails loadUserByUsername(String username);
    List<SimpleGrantedAuthority> loadAuthoritiesByUsername(String username);

    Long getUserIdByApiKey(@Param("apiKey") String apiKey);
}
