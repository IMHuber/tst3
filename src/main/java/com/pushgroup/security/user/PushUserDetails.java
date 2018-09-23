package com.pushgroup.security.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Collections;


public class PushUserDetails extends User {
    private Boolean enabled;
    private String apiKey;

    public PushUserDetails(String username, String password, Boolean enabled, String apiKey) {
        super(username, password, Collections.EMPTY_LIST);
        this.enabled = enabled;
        this.apiKey = apiKey;
    }
    
    public PushUserDetails(String username, String password, Boolean enabled, String apiKey, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.enabled = enabled;
        this.apiKey = apiKey;
    }

    public String getApiKey() {
        return apiKey;
    }
}
